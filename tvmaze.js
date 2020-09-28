/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  // TODO: Make an ajax request to the searchShows api.  Remove
  // hard coded data.
  let res = await axios.get("https://api.tvmaze.com/search/shows", {params: {q: query}});
  return res.data;
}



/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */

function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();
  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show my-5" data-show-id="${show.show.id}">
         <div class="card" data-show-id="${show.show.id}">
         <img class="card-img-top" src="${show.show.image.medium || "https://tinyurl.com/tv-missing"}" alt="Card image cap">
           <div class="card-body">
             <h5 class="card-title">${show.show.name}</h5>
             <p class="card-text">${show.show.summary}</p>
             <button class="btn btn-primary episodes-btn">Show Episodes</button>
           </div>
         </div>
       </div>
      `);
    $item.on("click", ".episodes-btn", function handleEpisodesBtn(evt) {
      getEpisodes($(evt.target).closest(".card").data("showId"));
    })
    $showsList.append($item);
  }
}


/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});


/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
  let res = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  populateEpisodes(res.data);
}

async function populateEpisodes(episodes) {
  $("#modal-list").empty()
  for (let episode of episodes) {
    let $episode = $(
        `
          <li>${episode.name} (season ${episode.season}, number ${episode.number})</li>
        `
      );
    $("#modal-list").append($episode);
  }
  $('#episodesModal').modal('show');
}