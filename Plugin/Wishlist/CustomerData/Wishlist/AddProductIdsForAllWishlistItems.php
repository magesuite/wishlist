<?php

namespace MageSuite\Wishlist\Plugin\Wishlist\CustomerData\Wishlist;

class AddProductIdsForAllWishlistItems
{
    const PACKAGE_SIZE = 1000;

    protected \Magento\Wishlist\Helper\Data $wishlistHelper;

    protected \MageSuite\Wishlist\Helper\Configuration $configuration;

    protected \MageSuite\Wishlist\Model\ResourceModel\Wishlist\GetProductIds $getProductIds;

    public function __construct(
        \Magento\Wishlist\Helper\Data $wishlistHelper,
        \MageSuite\Wishlist\Helper\Configuration $configuration,
        \MageSuite\Wishlist\Model\ResourceModel\Wishlist\GetProductIds $getProductIds
    ) {
        $this->wishlistHelper = $wishlistHelper;
        $this->configuration = $configuration;
        $this->getProductIds = $getProductIds;
    }

    public function afterGetSectionData(\Magento\Wishlist\CustomerData\Wishlist $subject, $result)
    {
        if (!$this->configuration->isAdditionalDataEnabled()) {
            return $result;
        }

        $wishlistId = (int)$this->wishlistHelper->getWishlist()->getId();
        $result['product_ids'] = $wishlistId > 0
            ? $this->getProductIds->execute($wishlistId)
            : [];

        return $result;
    }
}
