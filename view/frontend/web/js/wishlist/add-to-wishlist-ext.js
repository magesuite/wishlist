/**
 * Block default add to wishlist form and use ajax instead
 * The goal is to not reload the page or go to the user area after product is added to wishlist.
 */
define(['jquery', 'Magento_Customer/js/customer-data', 'mage/url', 'mage/cookies'], function($, customerData, url) {
    'use strict';

    return function(addToWishlist) {
        $.widget('mage.addToWishlist', addToWishlist, {
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

                if (element.length && !(element.validation() && element.validation('isValid'))) {
                    return;
                } else {
                    this.ajaxAddToWishlist(event);
                }
            },
            ajaxAddToWishlist: function (event) {
                const $trigger = $(event.currentTarget);
                let params = $trigger.data('post');
                params.data['form_key'] = $.mage.cookies.get('form_key');

                const widget = this;

                $.ajax({
                    method: 'POST',
                    url: params.action,
                    data: params.data,
                })
                    .done(
                        function (response) {
                            if (response.backUrl) {
                                widget._onDoneHandler($trigger);
                            } else {
                                const uencParam = params.data.uenc ? params.data.uenc.replaceAll(',', '') : '';
                                window.location.replace(url.build('customer/account/login/referer/' + uencParam));
                            }
                            
                        }.bind(widget)
                    )
                    .fail(
                        function (response) {
                            if (
                                response.responseJSON &&
                                response.responseJSON.message
                            ) {
                                widget._onFailHandler(response.responseJSON.message);
                            }
                        }.bind(widget)
                    );
            },
            /**
             * After AJAX request returned with data -
             * @param {object} response - ajax response
             */
            _onDoneHandler($trigger) {
                $trigger.addClass('selected');

                customerData.invalidate(['wishlist', 'messages']);
                customerData.reload(['wishlist', 'messages'], true);

                const newQty = parseInt($('.cs-header-user-nav__qty-counter--wishlist .qty').text()) + 1;

                const $wishlistBadge = $('.cs-header-user-nav .cs-header-user-nav__qty-counter--wishlist');
                const wishlistBadgeRect = $wishlistBadge[0].getBoundingClientRect();

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

            /**
             * After AJAX request FAILED -
             * @param {string} error - XHR error message
             */
            _onFailHandler(error) {
                return;
            },

        });

        return $.mage.addToWishlist;
    };
});