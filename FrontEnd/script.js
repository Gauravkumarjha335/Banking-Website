'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const openModal = function () {
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainers = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');


/////////////////////////
// Button Scrolling
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', (e) => {
  section1.scrollIntoView({ behavior: 'smooth' });
})

//////////////////////////
// Page Navigation

// document.querySelectorAll('.nav__link').forEach(function(el){
//   el.addEventListener('click',function(e){
//     console.log('LINKS');
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({behavior:'smooth'})
//   })
// })

// 1. add event listener to comon parent element
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // 2. Determine what element originated the event
  // Matching Stategy
  if (e.target.classList.contains('nav__link')) {

    const id = e.target.getAttribute('href');
    // console.log(id);
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' })
  }
})

//   Tabbed Component

tabsContainers.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');
  //  console.log(clicked);
  //  console.log(clicked.dataset.tab);
  // Guard Clause
  if (!clicked) return;
  // remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));

  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // Active tab
  clicked.classList.add('operations__tab--active');

  // Active content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active')
})

// Menu fade animation

const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach((el) => {
      if (el !== link) {
        el.style.opacity = this;
      }
    })
    logo.style.opacity = this;
  }
}

// nav.addEventListener('mouseover',function(e){
//   handleHover(e,0.5);
// })
// nav.addEventListener('mouseout',function(e){
//   handleHover(e,1);
// })
// Passing "Argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

// Sticky Navigation
// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);
// window.addEventListener('scroll',()=>{
//   console.log();
//   if(window.scrollY > initialCoords.top)
//   nav.classList.add('sticky');
// else
// nav.classList.remove('sticky')
// })

// const obsCallback = function(entries,observer){
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// }

// const obsOptions = {
//   root: null,
//   threshold: 0.2,
// }

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting)
    nav.classList.add('sticky');
  else
    nav.classList.remove('sticky');
}
const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
})

headerObserver.observe(header);

// Reveal Section
const allSection = document.querySelectorAll('.section');

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target)
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
})

allSection.forEach(function (section) {
  sectionObserver.observe(section);
  // yhi hai
  // section.classList.add('section--hidden');
})

// Lazy Loading Images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;

  // Replace src with data-src 
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', () => {
    entry.target.classList.remove('lazy-img');
  })
  observer.unobserve(entry.target)
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  // remove - for earlier loading its not nessesary
  rootMargin: '200px',
})

imgTargets.forEach(img => imgObserver.observe(img));


// Slider
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');

let curSlide = 0;
const maxSlide = slides.length - 1;

// Functions
const slider = function () {


  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML('beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    })
  }


  const activeDot = function (slide) {
    document.querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document.querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active')
  }



  const gotoSlide = function (slide) {
    slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  }



  //next slide
  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }
    gotoSlide(curSlide);
    activeDot(curSlide);
  }

  //prev slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }

    gotoSlide(curSlide);
    activeDot(curSlide);
  }

  const init = function () {
    gotoSlide(0);
    createDots();
    activeDot(0);
  }

  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', e => {
    // console.log(e);
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  })

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // console.log('DOT');
      // const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset;
      gotoSlide(slide);
      activeDot(slide);
    }
  })
};
slider();
/*

// Selecting Elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);
document.getElementById('section--1');
const allBtn = document.getElementsByTagName('button');
console.log(allBtn);
console.log(document.getElementsByClassName('btn'));
const message = document.createElement('div');
message.classList.add('cookie-message');

message.innerHTML = 'we use cookie for improved functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>';

// header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true));
// header.before(message)
header.after(message)

document.querySelector('.btn--close--cookie').addEventListener('click',()=>{
  message.remove();
})

// Styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

console.log(message.style.color);
console.log(message.style.backgroundColor);

console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height = Number.parseFloat(getComputedStyle(message).height,10) + 20 + 'px';

document.documentElement.style.setProperty('--color-primary','orangered');

// Attributes
const logo = document.querySelector('.nav__logo');
console.log(logo.src);
console.log(logo.alt);
console.log(logo.className);

logo.alt = 'Beautiful minimalist logo'

// Non-Standered
console.log(logo.designer);
console.log(logo.getAttribute('designer'));
logo.setAttribute('Company','Bankist');

const link = document.querySelector('.nav__link--btn');
console.log(link.href);
console.log(link.getAttribute('href'));

// Data Attributes
console.log(logo.dataset.versionNumber);

// Classes
logo.classList.add('c','j');
logo.classList.remove('c','j');
logo.classList.toggle('c');
logo.classList.contains('c'); // not includes

// Don't use Bcz it is override all the previous classes
logo.classList ='Ramesh';
*/
/*
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click',(e)=>{
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords);
  relative to visible viewPort
  console.log(e.target.getBoundingClientRect());
  console.log(
    'current scroll (X/Y)',
    window.scrollX,
    window.scrollY
    );

  console.log(
    'width/height viewport',
    document.documentElement.clientWidth,
    document.documentElement.clientHeight
    );

  Scrolling
  window.scrollTo(
    s1coords.left + window.scrollX,
    s1coords.top + window.scrollY
    );

  window.scrollTo({
    left: s1coords.left + window.scrollX,
    top: s1coords.top + window.scrollY,
    behavior: 'smooth'
  })

  section1.scrollIntoView({behavior: 'smooth'});
})
*/
/*
const h1 = document.querySelector('h1');

const alertH1 = function(e){
  alert('addEventListener: Great! You are reading heading :D')
  h1.removeEventListener('mouseenter',alertH1);
}

h1.addEventListener('mouseenter', alertH1);

setTimeout(()=>h1.removeEventListener('mouseenter',alertH1),3000);

// modern way
h1.addEventListener('mouseenter',(e)=>{
  alert('addEventListener: Great! You are reading heading :D')
})

// old way
h1.onmouseenter = () => {
  alert('addEventListener: Great! You are reading heading :D')
}
*/
/*
// rgb(255,255,255)
const randomInt = (min,max) => Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () => `rgb(${randomInt(0,255)},${randomInt(0,255)},${randomInt(0,255)})`;
console.log(randomColor());

document.querySelector('.nav__link').addEventListener('click',function(e){
  this.style.backgroundColor = randomColor();
  console.log(e.target,e.currentTarget);
  console.log('target',e.currentTarget === this);

  // Stop Propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click',function(e){
  this.style.backgroundColor = randomColor();
  console.log('Container',e.target,e.currentTarget);
});

document.querySelector('.nav').addEventListener('click',function(e){
  this.style.backgroundColor = randomColor();
  console.log('NAV',e.target,e.currentTarget);
}, true);

*/
/*
const h1 = document.querySelector('h1');

// Going Downwards: child
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going Upwards: parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)'
h1.closest('h1').style.background = 'var(--gradient-primary)'

// Going Sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function(el){
  if(el!==h1){
    el.style.transform = 'scale(0.5)';
  }
})
*/

// document.addEventListener('DOMContentLoaded', (e) => {
//   // console.log('HTML parsed and Dom tree built!', e);
// })

// window.addEventListener('load', function (e) {
//   // console.log('Page fully loaded', e);
// })

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   e.returnValue = 'Your custom message here';
// });


