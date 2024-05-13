import type { Issue, Project } from "@/types"
import { useQuery } from "@apollo/client"

import { constructRepoQueries } from "../graphql/queries/get-issues"
import projectJson from "../public/opensource-projects/index.json"

const projectsMetadata = Object.entries(projectJson as Project).map(
    ([_, p]) => ({
        name: p.name,
        owner: p.org,
        languages: p.lang
    })
)
const labels = ["good first issue", "bug", "help wanted"]
const states = ["OPEN"]
const reposWithLabels = projectsMetadata.map((n) => ({
    ...n,
    labels,
    states
}))

export function useGetRepositoryIssues() {
    const { data, loading, error } = useQuery(
        constructRepoQueries(reposWithLabels),
        {
            fetchPolicy: "cache-and-network",
            nextFetchPolicy: "cache-first"
        }
    )

    const issues = data
        ? Object.entries(data).flatMap(([_, issuesData], index) => {
              if (!issuesData) return []
              return ((issuesData as any)?.issues?.edges as any[]).map(
                  (edge: { node: Issue }) => ({
                      ...edge.node,
                      owner: projectsMetadata[index].owner,
                      languages: projectsMetadata[index].languages,
                      repo: projectsMetadata[index].name
                  })
              )
          })
        : []

    return {
        issues,
        loading,
        error
    }
}
