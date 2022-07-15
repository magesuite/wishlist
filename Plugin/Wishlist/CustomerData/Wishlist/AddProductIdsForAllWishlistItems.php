<?php

namespace MageSuite\Wishlist\Plugin\Wishlist\CustomerData\Wishlist;

class AddProductIdsForAllWishlistItems
{
    const PACKAGE_SIZE = 1000;

    protected \Magento\Wishlist\Helper\Data $wishlistHelper;

    protected \MageSuite\Wishlist\Helper\Configuration $configuration;

<<<<<<< HEAD
    protected \MageSuite\Wishlist\Model\ResourceModel\Wishlist\GetProductIds $getProductIds;

    public function __construct(
        \Magento\Wishlist\Helper\Data $wishlistHelper,
        \MageSuite\Wishlist\Helper\Configuration $configuration,
        \MageSuite\Wishlist\Model\ResourceModel\Wishlist\GetProductIds $getProductIds
    ) {
        $this->wishlistHelper = $wishlistHelper;
        $this->configuration = $configuration;
        $this->getProductIds = $getProductIds;
=======
    public function __construct(
        \Magento\Wishlist\Helper\Data $wishlistHelper,
        \MageSuite\Wishlist\Helper\Configuration $configuration
    ) {
        $this->wishlistHelper = $wishlistHelper;
        $this->configuration = $configuration;
>>>>>>> 233e210 (feat: [IPET-1435] Extend wishlist in customerData, add product ids for all items from wishlist.)
    }

    public function afterGetSectionData(\Magento\Wishlist\CustomerData\Wishlist $subject, $result)
    {
        if (!$this->configuration->isAdditionalDataEnabled()) {
            return $result;
        }

<<<<<<< HEAD
        $wishlistId = $this->wishlistHelper->getWishlist()->getId();
        $result['product_ids'] = $this->getProductIds->execute($wishlistId);
=======
        $wishlistCollection = $this->wishlistHelper->getWishlistItemCollection();
        $wishlistCollection->clear()
            ->setPageSize(self::PACKAGE_SIZE)
            ->setInStockFilter()
            ->setOrder('added_at');

        $result['product_ids'] = $wishlistCollection->getColumnValues('product_id');
>>>>>>> 233e210 (feat: [IPET-1435] Extend wishlist in customerData, add product ids for all items from wishlist.)

        return $result;
    }
}
