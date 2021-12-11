document.addEventListener('DOMContentLoaded', () => {
    let uploaded_files = 0;
    let formData = new FormData();
    document.querySelector('#all-posts-link').addEventListener('click', load_posts());
    document.querySelector('form').onsubmit = (e) => post_submit(e);
    document.querySelector('#file-input').addEventListener('change', event => {

        //Saving image to database
        const files = event.target.files
        formData.append('myFile'+uploaded_files, files[0]);
        uploaded_files++;
        //Load images to the post form
        let file = event.target.files[0];
        console.log(file);
        if(file.type.indexOf('image/') !== 0){
            console.warn('not an image');
        }
        let img = new Image();
        img.src = URL.createObjectURL(file);
        img.setAttribute('class', 'post-images');
        img.setAttribute('data-id', uploaded_files-1);
        img.addEventListener('click', event => {
            let id = event.target.dataset.id;
            newFormData = new FormData();
            let i = 0;
            let k = 0;
            for (let key of formData.keys()){
                if (key == `myFile${id}`){

                }
                else{
                    newFormData.append(`myFile${k}`,formData.get(`myFile${i}`));
                    k++;
                }
                i++;
            }
            formData = newFormData;
            event.target.remove();
        });
        img.onload = () => {
            URL.revokeObjectURL(this.src);
        };
        document.querySelector('.post-image-section').appendChild(img);
    })
    //load_posts();

    let my_post_width = document.querySelector('#my-post').offsetWidth;
    let avatar_section_width = document.querySelector('.avatar-section').offsetWidth;
    let form_body = document.getElementById('form-body');
    width = my_post_width - avatar_section_width + 4;
    form_body.style.width = `${width}px`;
    console.log(form_body.offsetWidth);

    function post_submit(e){
        e.preventDefault();
        let body = document.querySelector('#post-body');
        let files = document.querySelector('.post-images');
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
                document.querySelector('#posts').insertBefore(div, document.querySelector('#posts').firstChild)
            })
            .catch(error => {
                console.error(error)
            })
        })
        .catch(error => {
            console.error(error)
        })
        
    }
})

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

    let user = document.createElement('span');
    user.setAttribute('class', 'post-author');
    user.innerHTML = post.author;

    let date = document.createElement('span');
    date.setAttribute('class', 'post-date');
    date.innerHTML = post.timestamp;

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

    div.append(avatar_div);
    div.append(user);
    div.append(date);
    div.append(text);
    let images = post.images;
    if (images.length > 0)
    {
        images.forEach(image => {
            let img = document.createElement('img');
            img.setAttribute('src', image);
            img.setAttribute('class', 'post-images');
            div.append(img);
        })
    }

    div.append(upvote_div);
    return div;
}

function load_posts(){
    fetch('/posts')
    .then(response => response.json())
    .then(posts => {
        posts.forEach(post => {
            div = post_upload(post);
            document.querySelector('#posts').append(div);
        });
    })
}