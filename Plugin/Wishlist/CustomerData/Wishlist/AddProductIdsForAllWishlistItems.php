<?php

declare(strict_types=1);

namespace MageSuite\Wishlist\Plugin\Wishlist\CustomerData\Wishlist;

class AddProductIdsForAllWishlistItems
{
    public function __construct(
        protected \Magento\Wishlist\Helper\Data $wishlistHelper,
        protected \MageSuite\Wishlist\Helper\Configuration $configuration,
        protected \MageSuite\Wishlist\Model\ResourceModel\Wishlist\GetProductIds $getProductIds,
        protected \Magento\Wishlist\Model\ResourceModel\Item\CollectionFactory $collectionFactory,
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

        $result['items_remove_data'] = $this->getItemsRemoveData();

        return $result;
    }

    protected function getItemsRemoveData(): array
    {
        $items = [];

        /** @var \Magento\Wishlist\Model\Item $item */
        foreach ($this->getWishlistItemCollection() as $item) {
            $items[] = [
                'product_id' => $item->getProductId(),
                'item_remove_params' => $this->wishlistHelper->getRemoveParams($item),
            ];
        }

        return $items;
    }

    protected function getWishlistItemCollection(): \Magento\Wishlist\Model\ResourceModel\Item\Collection
    {
        $wishlist = $this->wishlistHelper->getWishlist();

        $collection = $this->collectionFactory->create();
        $collection->addWishlistFilter($wishlist);
        $collection->addStoreFilter($wishlist->getSharedStoreIds());
        $collection->setVisibilityFilter(true);

        return $collection;
    }
}
