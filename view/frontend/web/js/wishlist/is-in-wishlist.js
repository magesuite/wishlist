define([
    'jquery',
    'uiComponent',
    'Magento_Customer/js/customer-data'
], function ($, Component, customerData) {
    'use strict';

    var wishlistData = customerData.get('wishlist');

    return Component.extend({
        defaults: {
            toWishlistClass: '.towishlist',
            wishlistItems: wishlistData().items
        },
        initialize: function () {
            this._super();
            this.checkWishlist();

            return this;
        },
        checkWishlist: function() {
            if (
                Array.isArray(this.wishlistItems) &&
                this.wishlistItems.length
            ) {
                this.wishlistItems.forEach((item) => {
                    $(this.toWishlistClass + '[data-product-id=' + item['product_id'] + ']').addClass('selected');
                });
            }
        },
    });
});
