const navLink = document.querySelectorAll(".nav-link");
navLink[3].addEventListener('click', e => {
    e.preventDefault();
    const portofolio = document.getElementById("project-portofolio");
    const targetPosition = portofolio.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth' // smooth scrolling
    });
});

navLink[2].addEventListener('click', e => {
    e.preventDefault();
    const services = document.getElementById("services");
    const targetPosition = services.getBoundingClientRect().top + window.scrollY - 60;
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth' // smooth scrolling
    });
});

// kirim email lewat html form
function sendEmail(e) {
    e.preventDefault()
    let params = {
        name: document.getElementById('name').value,
        number: document.getElementById('number').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value,
    };

    emailjs.send('service_zrobmwl', 'template_6oi9ibw', params).then(alert('Email sent!!'), error =>{
        alert('message failed to send. ' + error)
    })
}

const form = document.getElementById('contact-form');
form.addEventListener('submit', sendEmail);