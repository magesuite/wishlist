<?php

declare(strict_types=1);

namespace MageSuite\Wishlist\Plugin\Wishlist\CustomerData\Wishlist;

class AddProductIdsForAllWishlistItems
{
    public function __construct(
        protected \Magento\Wishlist\Helper\Data $wishlistHelper,
        protected \MageSuite\Wishlist\Helper\Configuration $configuration,
        protected \MageSuite\Wishlist\Model\ResourceModel\Wishlist\GetProductIds $getProductIds,
    ) {
    }

    public function afterGetSectionData(\Magento\Wishlist\CustomerData\Wishlist $subject, $result)
    {
        if (!$this->configuration->isAdditionalDataEnabled()) {
            return $result;
        }

        $storeIds = $this->wishlistHelper->getWishlist()->getSharedStoreIds();
        $wishlistId = (int) $this->wishlistHelper->getWishlist()->getId();
        $result['product_ids'] = $wishlistId > 0
            ? $this->getProductIds->execute($wishlistId, $storeIds)
            : [];

        return $result;
    }
}
