import { gql } from "@apollo/client"

export function constructRepoQueries(
    inputs: Array<{
        owner: string
        name: string
        labels: string[]
        states: string[]
    }>
) {
    const queryParts = inputs.map((input, index) => {
        const labelsFormatted = JSON.stringify(input.labels)
        const statesFormatted = input.states.join(", ")

        return `
      repo${index}: repository(owner: "${input.owner}", name: "${input.name}") {
        issues(first: 10, labels: ${labelsFormatted}, states: ${statesFormatted}) {
          edges {
            node {
              title
              url
              number
              publishedAt
            }
          }
        }
      }
    `
    })

    return gql`
         query GetIssues {
            ${queryParts.join("\n")}
         }
    `
}
