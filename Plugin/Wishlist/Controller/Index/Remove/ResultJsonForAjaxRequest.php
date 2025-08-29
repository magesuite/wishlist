<?php

declare(strict_types=1);

namespace MageSuite\Wishlist\Plugin\Wishlist\Controller\Index\Remove;

class ResultJsonForAjaxRequest
{
    public function __construct(
        protected \Magento\Framework\Controller\ResultFactory $resultFactory,
    ) {
    }

    public function afterExecute(\Magento\Wishlist\Controller\Index\Remove $subject, $result)
    {
        if ($subject->getRequest()->isAjax()) {
            /** @var \Magento\Framework\Controller\Result\Json $result */
            $result = $this->resultFactory->create(\Magento\Framework\Controller\ResultFactory::TYPE_JSON);
            $result->setData(['success' => true]);
        }

        return $result;
    }
}
