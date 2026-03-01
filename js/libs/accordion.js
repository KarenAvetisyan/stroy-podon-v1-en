"use strict";
document.addEventListener("DOMContentLoaded", function() {

  function Accordion(el, multiple) {
    this.el = el || null;
    this.multiple = multiple || false;
    this.links = this.el.querySelectorAll('._accordion-item__head');
    this.links.forEach(link => {
      link.addEventListener('click', (e) => {
        this.dropdown(e, link);
      });
    });
  }

  Accordion.prototype.dropdown = function(e, link) {
    const next = link.nextElementSibling;
    if (next.style.maxHeight) {
      next.style.maxHeight = null;
    } else {
      next.style.maxHeight = next.scrollHeight + "px";
    }
    link.parentElement.classList.toggle('open');
    if (!this.multiple) {
      this.links.forEach(otherLink => {
        const otherNext = otherLink.nextElementSibling;
        if (otherNext !== next) {
          otherNext.style.maxHeight = null;
          otherLink.parentElement.classList.remove('open');
        }
      });
    }
  };
  const accordionElement = document.getElementById('_accordion');
  const accordion = new Accordion(accordionElement, false);

});