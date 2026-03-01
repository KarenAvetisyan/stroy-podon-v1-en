document.addEventListener('DOMContentLoaded', function() {
    
    let productsData = [];
    let currentProduct = null;
    let quantity = 1;

    // Данные продукта 
    fetch('products.json')
    .then(res => res.json())
    .then(products => {

        productsData = products;
        const container = document.getElementById('products-container');
        container.innerHTML = products.map(product => {

            const detailsHTML = Object.entries(product.details)
            .map(([key, value]) =>
                `<li><span>${key}:</span> <span>${value}</span></li>`
            ).join('');

            return `
                <div class="_product _rounded-1 _shadow">
                    <div class="_product-top">

                        <a href="${product.image}"
                           data-fancybox
                           data-caption="${product.title}"
                           class="_product-img">
                            <img loading="lazy"
                                 src="${product.image}"
                                 alt="${product.title}">
                        </a>

                        <h3 class="_product-title">
                            ${product.title}
                        </h3>

                        <div class="_product-info">
                            <div class="_product-price__wrap">
                                <div class="_product-price__size">
                                    ${product.size}
                                </div>
                                <div class="_product-price">
                                    ${product.price} ${product.currency}
                                </div>
                            </div>

                            <a href="#"
                               class="_product-info__details-btn js-toggle-details"
                               data-toggle-details>
                               <span>Подробнее</span>
                               <i class="icon icon-dots">...</i>
                            </a>
                        </div>

                        <div class="_product-info__details _rounded-1 js-details">
                            <div class="_product-info__details-inner">
                                <h4>${product.title}</h4>
                                <div class="w-100">
                                    <div class="_line"></div>
                                </div>
                                <ul>${detailsHTML}</ul>
                            </div>

                            <button class="btn js-toggle-details close"
                                    data-toggle-details>
                                &times;
                            </button>
                        </div>

                    </div>

                    <div class="_product-bottom text-center">
                        <a href="#"
                           class="_product-order _btn-primary"
                           data-bs-toggle="modal"
                           data-bs-target="#_myModal_product"
                           data-product-id="${product.id}">
                           Заказать <i class="icon"></i>
                        </a>
                    </div>

                </div>
            `;

        }).join('');

    });


    // данные продукта в модальном окне 
    const modal = document.getElementById('_myModal_product');

    modal.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const productId = parseInt(button.getAttribute('data-product-id'));
        currentProduct = productsData.find(p => p.id === productId);
        if (!currentProduct) return;
        quantity = 1;
        document.getElementById('quantity').textContent = quantity;
        document.querySelector('[data-field="title"]').textContent = currentProduct.title;
        document.querySelector('[data-field="modalImage"]').src = currentProduct.image;
        document.querySelector('[data-field="modalPrice"]').textContent =
            currentProduct.price + ' ' + currentProduct.currency + ' за штуку';
            document.getElementById('formProductName').value = currentProduct.title;
            document.getElementById('formQuantity').value = quantity;
            document.getElementById('formTotalPrice').value = currentProduct.price * quantity + ' ' + currentProduct.currency;
            
            const detailsContainer = modal.querySelector('[data-field="modalDetails"]');
            detailsContainer.innerHTML = Object.entries(currentProduct.details)
                .map(([key, value]) =>
                    `<li>
                        <span>${key}:</span>
                        <span>${value}</span>
                    </li>`
                )
            .join('');
        updateTotalPrice();
    });

    // onclick="updateQuantity(...)"
    window.updateQuantity = function(change) {
        quantity += change;
        if (quantity < 1) quantity = 1;
        document.getElementById('quantity').textContent = quantity;
        document.getElementById('formQuantity').value = quantity;
        document.getElementById('formTotalPrice').value = currentProduct.price * quantity + ' ' + currentProduct.currency;

        updateTotalPrice();
    }
    function updateTotalPrice() {
        if (!currentProduct) return;
        const total = currentProduct.price * quantity;
        document.querySelector('[data-field="totalPrice"]').textContent =
            total + ' ' + currentProduct.currency;
    }

});