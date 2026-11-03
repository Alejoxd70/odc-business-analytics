import { Feedback as DragFeedback, PointerActivationConstraints, PointerSensor } from '@dnd-kit/dom'
import type { DragDropProvider } from '@dnd-kit/react'
import type { ComponentProps } from 'react'

/** Shared drag and drop configuration of the activities. */

type PluginsOption = NonNullable<ComponentProps<typeof DragDropProvider>['plugins']>
export type CustomizePlugins = Extract<PluginsOption, (...args: never[]) => unknown>
export type Plugins = Parameters<CustomizePlugins>[0]

// Touch: long press, so swiping still scrolls the page. Mouse and pen: a few pixels of movement.
export const pointerSensor = PointerSensor.configure({
  activationConstraints: event => event.pointerType === 'touch'
    ? [new PointerActivationConstraints.Delay({ value: 250, tolerance: 5 })]
    : [new PointerActivationConstraints.Distance({ value: 6 })],
})

/** No drop animation: the item lands where it belongs at once (also respects reduced motion). */
export const noDropAnimation = DragFeedback.configure({ dropAnimation: null })

export const isDragFeedback = (plugin: Plugins[number]) => plugin === DragFeedback
