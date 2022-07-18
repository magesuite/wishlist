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
            productIDs: wishlistData()['product_ids']
        },
        initialize: function () {
            this._super();
            this.checkWishlist();

            return this;
        },
        checkWishlist: function() {
            if (
                Array.isArray(this.productIDs) &&
                this.productIDs.length
            ) {
                this.productIDs.forEach((item) => {
                    $(this.toWishlistClass + '[data-product-id=' + item + ']').addClass('selected');
                });
            }
        },
    });
});
