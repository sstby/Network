document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.user-upvotes').style.display = 'none'
    load_socials();
})
function load_socials(){
    let user_id = document.querySelector('.header').dataset.user_id;
    let followers, follows;
    query = '/user/' + user_id;
    fetch(query)
    .then(response => response.json())
    .then(data => {
        let socials = document.querySelector('.socials');

        let a_follows = document.createElement('a');
        a_follows.setAttribute('href', '#');
        a_follows.innerHTML = `${data.follows.length} follows`;

        let a_followers = document.createElement('a');
        a_followers.setAttribute('href', '#');
        a_followers.innerHTML = `${data.followers.length} followers`;

        socials.append(a_follows);
        socials.append(a_followers);
    })
}