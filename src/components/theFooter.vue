<template>
  <footer>
    <div class="logo">TMDB-C</div>

    <div class="links">
      <ul>
        <li>
          <h2>THE BASICS</h2>
          <ul>
            <li>
              <app-link :to="'https://www.themoviedb.org/about'">About TMDB</app-link>
            </li>
            <li>
              <app-link to="https://www.themoviedb.org/about/staying-in-touch">Contact Us</app-link>
            </li>
            <li>
              <app-link to="https://www.themoviedb.org/talk">Support Forums</app-link>
            </li>
            <li>
              <app-link to="https://developer.themoviedb.org/docs"> API</app-link>
            </li>
            <li>
              <app-link to="https://status.themoviedb.org/">System Status</app-link>
            </li>
          </ul>
        </li>
        <li>
          <h2>GET INVOLVED</h2>
          <ul>
            <li>
              <app-link to="https://www.themoviedb.org/bible">Contribution Bible</app-link>
            </li>
            <li>
              <app-link to="https://www.themoviedb.org/movie/new">Add New Movie</app-link>
            </li>
            <li>
              <app-link to="https://www.themoviedb.org/tv/new">Add New TV Show</app-link>
            </li>
          </ul>
        </li>
        <li>
          <h2>COMMUNITY</h2>
          <ul>
            <li>
              <app-link to="https://www.themoviedb.org/documentation/community/guidelines"
                >Guidelines</app-link
              >
            </li>
            <li>
              <app-link to="https://www.themoviedb.org/discuss">Discussions</app-link>
            </li>
            <li>
              <app-link to="https://www.themoviedb.org/leaderboard">Leaderboard</app-link>
            </li>
          </ul>
        </li>
        <li>
          <h2>LEGAL</h2>
          <ul>
            <li>
              <app-link to="https://www.themoviedb.org/terms-of-use">Terms of Use</app-link>
            </li>
            <li>
              <app-link to="https://www.themoviedb.org/api-terms-of-use">API Terms of Use</app-link>
            </li>
            <li>
              <app-link to="https://www.themoviedb.org/privacy-policy">Privacy Policy</app-link>
            </li>
            <li>
              <app-link to="https://www.themoviedb.org/dmca-policy">DMCA Policy</app-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="description">
      This site is clone of TMDB. My purpose is improve myself. Source code is available on my&nbsp;
      <app-link :to="'https://github.com/nazifkivrik/moviedb-clone'"> github </app-link>&nbsp; page.
      You can reach me through this&nbsp;
      <app-link :to="'https://nazifkivrik.art/'"> site </app-link>&nbsp; .
    </div>
  </footer>
</template>

<style scoped lang="scss">
  footer {
    background-color: #03243f;
    color: white;
    padding: 30px 0;
    position: relative;
    bottom: 0;
    a {
      color: white;
    }
    ul {
      padding-inline-start: 0;
      list-style: none;
      h2 {
        width: max-content;
      }
      li {
        width: max-content;
      }
    }

    ul {
      display: flex;
      flex-direction: row;
      justify-content: center;
      column-gap: 75px;

      margin: 0;

      ul {
        display: flex;
        flex-direction: column;
        row-gap: 5px;
      }
    }
    .logo {
      position: absolute;
      top: 50%;
      left: 10%;
    }

    .description {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      bottom: 2px;
      width: 100%;
      font-size: 0.8em;
      a {
        text-decoration: underline;
      }
    }
  }
</style>
