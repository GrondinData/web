// Animation au scroll

const elements = document.querySelectorAll(".fade");


const observer = new IntersectionObserver(

(entries) => {

    entries.forEach(entry => {

        if(entry.isIntersecting){

            entry.target.classList.add("show");

            observer.unobserve(entry.target);

        }

    });

},

{
    threshold:0.15
}

);



elements.forEach(element => {

    observer.observe(element);

});
