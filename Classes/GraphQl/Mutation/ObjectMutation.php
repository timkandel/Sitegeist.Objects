<?php
namespace Sitegeist\Objects\GraphQl\Mutation;

/*
 * Copyright notice
 *
 * (c) 2018 Wilhelm Behncke <behncke@sitegeist.de>
 * All rights reserved
 *
 * This file is part of the Sitegeist/Objects project under GPL-3.0.
 *
 * For the full copyright and license information, please read the
 * LICENSE.md file that was distributed with this source code.
 */

use Neos\Flow\Annotations as Flow;
use Neos\ContentRepository\Domain\Model\NodeInterface;
use Neos\ContentRepository\Domain\Service\ContextFactoryInterface;
use Neos\ContentRepository\Domain\Service\NodeTypeManager;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;
use Wwwision\GraphQL\TypeResolver;
use Sitegeist\Objects\Domain\Model\ObjectDetail;
use Sitegeist\Objects\GraphQl\Query\ObjectDetailQuery;
use Sitegeist\Objects\GraphQl\Scalar\JsonScalar;
use Sitegeist\Objects\Service\NodeService;

class ObjectMutation extends ObjectType
{
    /**
     * @Flow\Inject
     * @var NodeService
     */
    protected $nodeService;

    /**
     * @param TypeResolver $typeResolver
     */
    public function __construct(TypeResolver $typeResolver)
    {
        return parent::__construct([
            'name' => 'ObjectMutation',
            'fields' => [
                'update' => [
                    'type' => Type::nonNull($typeResolver->get(ObjectDetailQuery::class)),
                    'description' => 'Update the object',
                    'args' => [
                        'properties' => [
                            'type' => JsonScalar::type(),
                            'description' => 'Properties for the newly created node'
                        ]
                    ],
                    'resolve' => function (NodeInterface $objectNode, $arguments) {
                        $this->nodeService->applyPropertiesToNode($objectNode, $arguments['properties']);

                        return new ObjectDetail($objectNode->getNodeType(), $objectNode);
                    }
                ],
                'hide' => [
                    'type' => Type::nonNull($typeResolver->get(ObjectDetailQuery::class)),
                    'description' => 'Hide the object',
                    'resolve' => function (NodeInterface $objectNode, $arguments) {
                        $objectNode->setHidden(true);

                        return new ObjectDetail($objectNode->getNodeType(), $objectNode);
                    }
                ],
                'show' => [
                    'type' => Type::nonNull($typeResolver->get(ObjectDetailQuery::class)),
                    'description' => 'Show (unhide) the object',
                    'resolve' => function (NodeInterface $objectNode, $arguments) {
                        $objectNode->setHidden(false);

                        return new ObjectDetail($objectNode->getNodeType(), $objectNode);
                    }
                ],
                'publish' => [
                    'type' => Type::listOf($typeResolver->get(ObjectDetailQuery::class)),
                    'description' => 'Publish the object',
                    'resolve' => function (NodeInterface $objectNode, $arguments) {
                        $publishedNodes = $this->nodeService->publishNode($objectNode);

                        foreach ($publishedNodes as $publishedNode) {
                            yield new ObjectDetail($publishedNode->getNodeType(), $publishedNode);
                        }
                    }
                ],
                'discard' => [
                    'type' => Type::listOf($typeResolver->get(ObjectDetailQuery::class)),
                    'description' => 'Publish the object',
                    'resolve' => function (NodeInterface $objectNode, $arguments) {
                        $discardedNodes = $this->nodeService->discardNode($objectNode);

                        foreach ($discardedNodes as $discardedNode) {
                            yield new ObjectDetail($discardedNode->getNodeType(), $discardedNode);
                        }
                    }
                ],
                'remove' => [
                    'type' => Type::nonNull($typeResolver->get(ObjectDetailQuery::class)),
                    'description' => 'Remove the object',
                    'resolve' => function (NodeInterface $objectNode, $arguments) {
                        $objectNode->remove();

                        return new ObjectDetail($objectNode->getNodeType(), $objectNode);
                    }
                ]
            ]
        ]);
    }
}