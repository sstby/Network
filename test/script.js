document.addEventListener('DOMContentLoaded', () => {
    let mid = document.querySelector('.main-content');

    for (let i = 0; i < 70; i++){
        let tmp_s = document.createElement('span');
        tmp_s.innerHTML = "Tmp content";
        
        mid.append(tmp_s);
        mid.append(document.createElement('br'));
    }
    mid.style.height = document.body.scrollHeight + 'px';
})