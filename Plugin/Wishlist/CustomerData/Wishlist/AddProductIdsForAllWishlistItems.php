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

        $wishlist = $this->wishlistHelper->getWishlist();

        if ($wishlist === null) {
            return $result;
        }

        $wishlistId = (int) $wishlist->getId();
        $result['product_ids'] = $wishlistId > 0
            ? $this->getProductIds->execute($wishlistId, $wishlist->getSharedStoreIds())
            : [];

        $result['items_remove_data'] = $this->getItemsRemoveData();

        return $result;
    }

    protected function getItemsRemoveData(): array
    {
        $itemCollection = $this->getWishlistItemCollection();

        if ($itemCollection === null) {
            return [];
        }

        $items = [];

        /** @var \Magento\Wishlist\Model\Item $item */
        foreach ($itemCollection as $item) {
            $items[] = [
                'product_id' => $item->getProductId(),
                'item_remove_params' => $this->wishlistHelper->getRemoveParams($item),
            ];
        }

        return $items;
    }

    protected function getWishlistItemCollection(): ?\Magento\Wishlist\Model\ResourceModel\Item\Collection
    {
        $wishlist = $this->wishlistHelper->getWishlist();

        if ($wishlist === null) {
            return null;
        }

        $collection = $this->collectionFactory->create();
        $collection->addWishlistFilter($wishlist);
        $collection->addStoreFilter($wishlist->getSharedStoreIds());
        $collection->setVisibilityFilter(true);

        return $collection;
    }
}
