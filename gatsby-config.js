module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `SFUSD Earth Day Every Day Challenge | Activity Menu`,
        short_name: `EDED Activity Menu`,
        start_url: `/`,
        display: `standalone`,
        icon: `src/img/favicon.jpg`
      }
    },
    `gatsby-plugin-styled-components`,
    `gatsby-plugin-react-helmet`,
  ]
}
