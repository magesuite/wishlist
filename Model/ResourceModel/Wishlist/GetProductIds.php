<?php

namespace MageSuite\Wishlist\Model\ResourceModel\Wishlist;

class GetProductIds
{
    protected \Magento\Framework\DB\Adapter\AdapterInterface $connection;

    public function __construct(\Magento\Framework\App\ResourceConnection $resourceConnection)
    {
        $this->connection = $resourceConnection->getConnection();
    }

    public function execute(int $wishlistId): array
    {
        $select = $this->connection->select()
            ->from(['wi' => $this->connection->getTableName('wishlist_item')], ['product_id'])
            ->where('wi.wishlist_id = ?', $wishlistId);

        return $this->connection->fetchCol($select);
    }
}
