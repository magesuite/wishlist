<?php

declare(strict_types=1);

namespace MageSuite\Wishlist\Plugin\Wishlist\Controller\Index\Cart;

class RemoveBackUrlForConfigureReferer
{
    public function __construct(
        protected \Magento\Checkout\Helper\Cart $cartHelper,
        protected \Magento\Framework\App\Response\RedirectInterface $redirect,
        protected \Magento\Framework\UrlInterface $urlBuilder,
        protected \Magento\Wishlist\Model\ItemFactory $itemFactory
    ) {
    }

    public function afterExecute(
        \Magento\Wishlist\Controller\Index\Cart $subject,
        \Magento\Framework\Controller\ResultInterface $result
    ): \Magento\Framework\Controller\ResultInterface {
        if (!$result instanceof \Magento\Framework\Controller\Result\Json) {
            return $result;
        }

        if (!$this->shouldRemoveBackUrl($subject)) {
            return $result;
        }

        $result->setData([]);

        return $result;
    }

    protected function shouldRemoveBackUrl(\Magento\Wishlist\Controller\Index\Cart $subject): bool
    {
        if (!$subject->getRequest()->isAjax()) {
            return false;
        }

        if ($this->cartHelper->getShouldRedirectToCart()) {
            return false;
        }

        return true;
    }

}
