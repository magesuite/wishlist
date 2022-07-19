<?php

namespace MageSuite\Wishlist\Helper;

class Configuration
{
    const XML_PATH_WISHLIST_ADDITIONAL_DATA_IS_ENABLED = 'wishlist/additional_data/is_enabled';

    protected \Magento\Framework\App\Config\ScopeConfigInterface $scopeConfig;

    public function __construct(\Magento\Framework\App\Config\ScopeConfigInterface $scopeConfigInterface)
    {
        $this->scopeConfig = $scopeConfigInterface;
    }

    public function isAdditionalDataEnabled()
    {
        return $this->scopeConfig->isSetFlag(self::XML_PATH_WISHLIST_ADDITIONAL_DATA_IS_ENABLED);
    }
}
