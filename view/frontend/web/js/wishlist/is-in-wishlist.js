/**
 * Component overwritten:
 * - Added handling of item_remove_params (provided via Plugin of CustomizationNkd)
 */
define([
    'uiComponent',
    'Magento_Customer/js/customer-data',
    'mage/translate',
    'mgsWaitForElement',
    'domReady!',
], function (Component, customerData, $t, mgsWaitForElement) {
    'use strict';

    return Component.extend({
        defaults: {
            toWishlistClass: '.towishlist',
            removeFromWishlistText: $t('Remove %1 from wishlist'),
            viewedProductsClass: '.block-viewed-products-grid .cs-product-tile',
        },
        initialize: function () {
            this._super();
            this.checkWishlist();

            mgsWaitForElement(this.viewedProductsClass).then(this.checkWishlist.bind(this));

            return this;
        },
        checkWishlist: function () {
            const wishlistData = customerData.get('wishlist');
            this.updateProducts(wishlistData());

            wishlistData.subscribe(this.updateProducts.bind(this));
        },
        updateProducts: function (data) {
            const productIDs = data['product_ids'],
                removeText = this.removeFromWishlistText;

            if (Array.isArray(productIDs) && productIDs.length) {
                productIDs.forEach((item) => {
                    const wishlistElements = document.querySelectorAll(
                        `${this.toWishlistClass}[data-product-id="${item}"]`
                    );
                    wishlistElements.forEach((wishlistElement) => {
                        const productName = wishlistElement.getAttribute('data-product-name') || '';

                        wishlistElement.classList.add('selected');
                        wishlistElement.setAttribute('title', removeText.replace('%1', productName));
                        wishlistElement.setAttribute('aria-label', removeText.replace('%1', productName));

                        if (!wishlistElement.dataset.itemRemoveParams) {
                            const itemRemoveParams =
                                data?.items_remove_data?.find(
                                    (wishlistItem) =>
                                        wishlistItem.product_id === item
                                )?.item_remove_params;

                            if (itemRemoveParams) {
                                wishlistElement.dataset.itemRemoveParams =
                                    itemRemoveParams;
                            }
                        }
                    });
                });
            }
        },
    });
});
