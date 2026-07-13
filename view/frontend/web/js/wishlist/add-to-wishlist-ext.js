/**
 * Mixin Entritely overwritten:
 * - introduced ajax add and ajax delete method (see related logic in is-in-wishlist component)
 */
define([
    'jquery',
    'Magento_Customer/js/customer-data',
    'mage/url',
    'mage/translate',
    'mage/cookies',
], function ($, customerData, url, $t) {
    'use strict';

    return function (addToWishlist) {
        $.widget('mage.addToWishlist', addToWishlist, {
            options: {
                addToWishlistTitle: $t('Add to Wishlist'),
                addToWishlistLabel: $t('Add %1 to wishlist'),
                removeFromWishlistText: $t('Remove %1 from wishlist'),
            },
            /**
             * Validate product quantity before updating Wish List
             * After validation passed call ajaxAddToWishlist action
             *
             * @param {jQuery.Event} event
             * @private
             */
            _validateWishlistQty: function (event) {
                var element = $(this.options.qtyInfo);

                event.preventDefault();
                event.stopPropagation();

                if (
                    element.length &&
                    !(element.validation() && element.validation('isValid'))
                ) {
                    return;
                }

                const trigger = event.currentTarget;
                if (
                    trigger.classList.contains('selected') &&
                    trigger.dataset.itemRemoveParams
                ) {
                    this.ajaxDeleteFromWishlist(trigger);
                } else {
                    this.ajaxAddToWishlist(trigger);
                }
            },
            ajaxDeleteFromWishlist: function (trigger) {
                // Remove selected class just after click in order to provide better user experience
                // If ajax request fails selected class will added back later
                this._triggerSelected(trigger, false);

                const params = JSON.parse(trigger.dataset.itemRemoveParams);
                params.data['form_key'] = $.mage.cookies.get('form_key');

                $.ajax({
                    method: 'POST',
                    url: params.action,
                    data: params.data,
                })
                .done(() => {
                    this._triggerSelected(trigger, false);
                    trigger.removeAttribute('data-item-remove-params');
                    this.reloadMessages();
                })
                .fail(() => {
                    this._triggerSelected(trigger);
                });
            },
            ajaxAddToWishlist: function (trigger) {
                // Add selected class just after click in order to provide better user experience
                // If ajax request fails selected class will be removed later, error will be served by BE to messages
                this._triggerSelected(trigger);

                const params = $(trigger).data('post');
                params.data['form_key'] = $.mage.cookies.get('form_key');

                const widget = this;

                $.ajax({
                    method: 'POST',
                    url: params.action,
                    data: params.data,
                })
                .done((response) => {
                    if (response.backUrl) {
                        this._triggerSelected(trigger);

                        widget._onDoneHandler($(trigger));

                        this.reloadCustomerData();
                        this.reloadMessages();
                    } else {
                        const uencParam = params.data.uenc
                            ? params.data.uenc.replaceAll(',', '')
                            : '';
                        window.location.replace(
                            url.build(
                                'customer/account/login/referer/' +
                                uencParam
                            )
                        );
                    }
                })
                .fail(() => this._triggerSelected(trigger, false));
            },
            /**
             * Toggle element class, label and title attributes
             *
             * @param {Object} element
             * @param {Boolean} selected // pass 'false' to disable selected
             */
            _triggerSelected(element, selected = true) {
                const $element = $(element),
                    productName = $element.attr('data-product-name') || '',
                    removeText = this.options.removeFromWishlistText.replace('%1', productName);

                if (selected) {
                    $element.addClass('selected');
                } else {
                    $element.removeClass('selected');
                }

                $element.attr('title', selected ? removeText : this.options.addToWishlistTitle);
                $element.attr('aria-label', selected ? removeText : this.options.addToWishlistLabel.replace('%1', productName));
            },
            /**
             * After AJAX request returned with data -
             * @param {object} response - ajax response
             */
            _onDoneHandler($trigger) {
                customerData.invalidate(['wishlist', 'messages']);
                customerData.reload(['wishlist', 'messages'], true);

                const $wishlistBadge = $('.cs-header-user-nav .cs-header-user-nav__qty-counter--wishlist');

                if (!$wishlistBadge.length) {
                    return;
                }

                const wishlistBadgeRect = $wishlistBadge[0].getBoundingClientRect();
                const newQty = parseInt($('.cs-header-user-nav__qty-counter--wishlist .qty').first().text()) + 1;

                let $clonedBadge = $('.cs-header-user-nav__qty-counter--wishlist-cloned');
                if ($clonedBadge.length) {
                    $clonedBadge.remove();
                }
                $clonedBadge = $wishlistBadge.clone();

                if (
                    !$clonedBadge.length ||
                    !$trigger.length
                ) {
                    return;
                }

                const icon = $trigger.find('.towishlist-icon')[0];
                let $startingElement = icon ? icon : $trigger[0];
                const startingPosition = $startingElement.getBoundingClientRect();
                const $clonedQtyHolder = $clonedBadge.find('.cs-header-user-nav__qty-counter-span');

                $clonedQtyHolder.html(newQty);

                $('body').append($clonedBadge);
                $clonedBadge.addClass('cs-header-user-nav__qty-counter--wishlist-cloned');
                $clonedBadge.css({
                    top: `${Math.round(parseInt(startingPosition.top, 10))}px`,
                    left: `${Math.round(parseInt(startingPosition.left, 10))}px`,
                });

                setTimeout(function() {
                    $clonedBadge
                    .addClass('cs-header-user-nav__qty-counter--wishlist-animating')
                    .css({
                        top: Math.round(parseInt(wishlistBadgeRect.top, 10)) > 0 ? Math.round(parseInt(wishlistBadgeRect.top, 10)) + 'px' : '-10rem',
                        left: Math.round(parseInt(wishlistBadgeRect.left, 10)) + 'px',
                    });
                }, 300);

                $clonedBadge.one('transitionend', function() {
                    $clonedBadge.remove();
                });
            },
            reloadCustomerData: function () {
                customerData.reload(['wishlist'], true);
            },
            reloadMessages: function () {
                // Hide message after 5 seconds
                setTimeout(function() {
                    customerData.reload(['messages'], true);
                }, 5000);
            },
        });

        return $.mage.addToWishlist;
    };
});
