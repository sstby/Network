document.addEventListener('DOMContentLoaded', function() {
    
    let uploaded_files = 0;
    let formData = new FormData();
    //document.querySelector('#all-posts-link').addEventListener('click', load_posts());
    //Send images and then post to database
    document.querySelector('form').onsubmit = (e) => post_submit(e);
    //Upload images to form
    //Saving image and post to database and appending it on page
    function post_submit(e){
        e.preventDefault();
        let body = document.querySelector('#post-text');
        fetch('/image_upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(images => {

            fetch('/create_post', {
                method: 'POST',
                body: JSON.stringify({
                    body: body.value,
                    images: images
                })
            })
            .then(response => response.json())
            .then(data => {
                div = post_upload(data);
                div.setAttribute('class', 'post uploading-post');
                div.style.animationPlayState = 'running';

                try {
                    document.querySelector('.posts').insertBefore(div, document.querySelector('.posts').firstChild)
                }
                catch {
                    document.querySelector('.posts').append(div);
                }

            })
            .catch(error => {
                console.error(error)
            })
        })
        .catch(error => {
            console.error(error)
        })
        
    }
    
    
});
function open_user_profile(event) {
    window.location.replace("http://127.0.0.1:8000/" + 'user/' + event.target.innerHTML) 
}
//Create div with post
function post_upload(post){
    console.log(post.author_avatar);
    let avatar_div = document.createElement('div');
    avatar_div.setAttribute('class', 'avatar-section');
    let img = document.createElement('img');
    img.setAttribute('src', post.author_avatar);
    img.setAttribute('class', 'post-avatar');
    avatar_div.append(img);

    let div = document.createElement('div');
    div.setAttribute('class', 'post');

    let info_block = document.createElement('div');
    info_block.setAttribute('class', 'post-info')
    let content = document.createElement('div');
    content.setAttribute('class', 'post-content');

    let user = document.createElement('span');
    user.setAttribute('class', 'post-author');
    user.addEventListener('click', event => open_user_profile(event))
    user.innerHTML = post.author;

    let date = document.createElement('span');
    date.setAttribute('class', 'post-date');
    date.innerHTML = post.timestamp;

    info_block.append(user);
    info_block.append(date);

    let text = document.createElement('p');
    text.setAttribute('class', 'post-text');
    text.innerHTML = post.body;

    let upvote_div = document.createElement('div');
    upvote_div.setAttribute('class', 'upvote-block')
    let upvote_btn = document.createElement('button');
    upvote_btn.setAttribute('class', 'post-upvote-btn');
    let upvote_img = document.createElement('img');
    upvote_img.setAttribute('src', 'https://img.icons8.com/external-flatart-icons-outline-flatarticons/20/000000/external-like-instagram-flatart-icons-outline-flatarticons.png');
    upvote_btn.append(upvote_img);

    let upvotes_count = document.createElement('span');
    upvotes_count.setAttribute('class', 'post-upvotes-count')
    upvotes_count.innerHTML = post.upvotes;
    upvote_div.append(upvote_btn);
    upvote_div.append(upvotes_count);

    content.append(info_block);
    content.append(text);

    let img_div = document.createElement('div');
    img_div.setAttribute('class', 'post-images');
    

    let images = post.images;
    if (images.length > 0)
    {
        images.forEach(image => {
            let post_image = document.createElement('div');
            post_image.setAttribute('class', 'post_image');
            let img = document.createElement('img');
            img.setAttribute('src', image);
            post_image.append(img);
            img_div.append(post_image);
        })
    }
    content.append(img_div);
    content.append(upvote_div);
    div.append(avatar_div);
    div.append(content);

    return div;
}

//Load posts from databese
function load_posts() {
    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => {
            div = post_upload(post);
            document.querySelector('.posts').append(div);
        });
    })
}