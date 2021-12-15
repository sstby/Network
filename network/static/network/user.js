document.addEventListener('DOMContentLoaded', () => {
    let mid = document.querySelector('.main-content');
    mid.style.height = document.body.scrollHeight + 'px';
    document.querySelector('.user-upvotes').style.display = 'none';
    document.querySelector('#user_posts').addEventListener('click', () => load_selected_posts('posts'));
    document.querySelector('#user_upvotes').addEventListener('click', () => load_selected_posts('upvotes'));

    load_socials();
})

function load_selected_posts(posts){
    if (posts == 'posts'){
        document.querySelector('.user-upvotes').style.display = 'none';
        document.querySelector('.user-posts').style.display = 'block';
        document.querySelector('#user_posts').setAttribute('class', 'load-posts-btn btn-active');
        document.querySelector('#user_upvotes').setAttribute('class', 'load-posts-btn');
    }
    else {
        document.querySelector('.user-posts').style.display = 'none';user-posts
        document.querySelector('.user-upvotes').style.display = 'block';
        document.querySelector('#user-upvotes').setAttribute('class', 'load-posts-btn btn-active');
        document.querySelector('#user_posts').setAttribute('class', 'load-posts-btn');
    }
}
function load_socials(){
    let user_id = document.querySelector('.header').dataset.user_id;
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