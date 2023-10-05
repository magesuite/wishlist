define([
    'jquery',
    'uiComponent',
    'Magento_Customer/js/customer-data'
], function ($, Component, customerData) {
    'use strict';

    return Component.extend({
        defaults: {
            toWishlistClass: '.towishlist'
        },
        initialize: function () {
            this._super();
            this.checkWishlist();

            return this;
        },
        checkWishlist: function() {
            var wishlistData = customerData.get('wishlist');
            this.updateProducts(wishlistData());

            wishlistData.subscribe(function(updatedWishlistData) {
                this.updateProducts(updatedWishlistData);
            }.bind(this));
        },
        updateProducts: function(data) {
            const productIDs = data['product_ids'];

            if (
                Array.isArray(productIDs) &&
                productIDs.length
            ) {
                productIDs.forEach((item) => {
                    $(this.toWishlistClass + '[data-product-id=' + item + ']').addClass('selected');
                });
            }
        }
    });
});
