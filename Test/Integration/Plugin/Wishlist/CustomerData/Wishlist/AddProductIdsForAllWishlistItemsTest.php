<?php

namespace MageSuite\Wishlist\Plugin\Wishlist\CustomerData\Wishlist;

/**
 * @magentoDbIsolation disabled
 * @magentoAppIsolation enabled
 */
class AddProductIdsForAllWishlistItemsTest extends \PHPUnit\Framework\TestCase
{
    /**
     * @var \Magento\TestFramework\ObjectManager
     */
    protected $objectManager;

    /**
     * @var \Magento\Customer\Model\Session
     */
    protected $customerSession;

    /**
     * @var \Magento\Wishlist\CustomerData\Wishlist
     */
    protected $wishlistCustomerData;

    public function setUp(): void
    {
        $this->objectManager = \Magento\TestFramework\ObjectManager::getInstance();

        $this->customerSession = $this->objectManager->get(\Magento\Customer\Model\Session::class);
        $this->wishlistCustomerData = $this->objectManager->get(\Magento\Wishlist\CustomerData\Wishlist::class);
    }

    /**
     * @magentoAppArea frontend
     * @magentoConfigFixture default/wishlist/additional_data/is_enabled 1
     * @magentoDataFixture Magento/Wishlist/_files/wishlist_with_multiple_products.php
     */
    public function testProductsIdsInWishlistCustomerData()
    {
        $expectedProductIds = ['10', '11'];

        $this->customerSession->loginById(1);

        $data = $this->wishlistCustomerData->getSectionData();

        $this->assertArrayHasKey('product_ids', $data);
        $this->assertEquals($expectedProductIds, $data['product_ids']);
    }
}
