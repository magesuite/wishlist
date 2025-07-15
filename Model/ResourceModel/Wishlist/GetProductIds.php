<?php

declare(strict_types=1);

namespace MageSuite\Wishlist\Model\ResourceModel\Wishlist;

class GetProductIds
{
    protected \Magento\Framework\DB\Adapter\AdapterInterface $connection;

    public function __construct(\Magento\Framework\App\ResourceConnection $resourceConnection)
    {
        $this->connection = $resourceConnection->getConnection();
    }

    public function execute(int $wishlistId, array $storeIds = []): array
    {
        $select = $this->connection->select();
        $select->from(['wi' => $this->connection->getTableName('wishlist_item')], ['product_id']);
        $select->where('wi.wishlist_id = ?', $wishlistId);

        if (!empty($storeIds)) {
            $select->where('wi.store_id IN (?)', $storeIds);
        }

        return $this->connection->fetchCol($select);
    }
}
