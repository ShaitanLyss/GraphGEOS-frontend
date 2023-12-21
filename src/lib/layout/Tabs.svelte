<script lang="ts">
	import { ErrorWNotif } from '$lib/global';
	import type { AddModel, AddModelProps, SetMainAddModel, TabContext, TabProps } from '$lib/layout';
	import { faTimes } from '@fortawesome/free-solid-svg-icons';
	import { Tab, TabGroup } from '@skeletonlabs/skeleton';
	import Fa from 'svelte-fa';
	import { flip } from 'svelte/animate';
	import { writable, type Writable } from 'svelte/store';
	import { fade, fly } from 'svelte/transition';
	import { type DragOptions, draggable, type DragEventData } from '@neodrag/svelte';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import type { Action } from 'svelte/action';

	let tabs: Map<string, TabProps> = new Map();
	let tabsOrder: string[] = [];
	let tabSet: Writable<string | undefined> = writable();

	export const tabsContext: TabContext = {
		tabSet,
		clearTabs() {
			tabs.clear();
			tabsOrder = [];
			tabs = tabs;
			$tabSet = undefined;
			mainAddModel = undefined;
		},
		setMainAddModel(option) {
			mainAddModel = option;
		},
		addTab({ key, props }) {
			if (tabs.has(key)) throw new ErrorWNotif({ emessage: 'Tab already exists' });
			tabs.set(key, { ...props, id: key });
			tabsOrder = [...tabsOrder, key];
			tabs = tabs;
			if (props.select ?? true) $tabSet = key;
		},
		deleteTab(key) {
			// Update tabset
			if ($tabSet === key) {
				// try to select the next tab
				if (tabs.size > 0) {
					const index = tabsOrder.indexOf(key);
					if (index === tabs.size - 1) {
						$tabSet = tabsOrder[index - 1];
					} else {
						$tabSet = tabsOrder[index + 1];
					}
				} else {
					$tabSet = undefined;
				}
			}
			tabs.delete(key);
			tabsOrder = tabsOrder.filter((tabKey) => tabKey !== key);
			tabs = tabs;
		},
		renameTab(key, name) {
			if (!tabs.has(key)) throw new ErrorWNotif({ emessage: 'Tab does not exist' });
			tabs.get(key)!.name = name;
			tabs = tabs;
		},
		getTabKeys() {
			return [...tabsOrder];
		}
	};
	const flipDuration = 100;
	let isWaitingForFlip = false;
	let dragCloneProps: TabProps | undefined = undefined;
	let dragClone: HTMLElement | undefined = undefined;
	let count = 0;
	const draggableTabOptions: DragOptions = {
		axis: 'x',
		bounds: 'parent',
		defaultClassDragging: 'variant-soft-surface',
		onDragStart(data) {},
		onDrag(data) {
			if (isWaitingForFlip) return;
			const { offsetX, offsetY, currentNode, rootNode } = data;
			if (!currentNode) return;
			const rect = currentNode.getBoundingClientRect();
			if (!rootNode.parentElement) throw new ErrorWNotif({ emessage: 'No parent element' });
			const neodrags = Array.from(rootNode.parentElement.querySelectorAll('.mydrag'));
			// // find out which element is the closest
			let closestElement: Element | undefined = undefined;
			let closestDistance = Infinity;
			let closestIndex = -1;
			neodrags.forEach((element, index) => {
				const elementRect = element.getBoundingClientRect();
				const distance = Math.sqrt(
					Math.pow(elementRect.x - rect.x, 2) + Math.pow(elementRect.y - rect.y, 2)
				);
				if (distance < closestDistance) {
					closestDistance = distance;
					closestElement = element;
					closestIndex = index;
				}
			});
			if (closestIndex == -1) return;
			const currentIndex = tabsOrder.indexOf(rootNode.id);
			if (currentIndex === closestIndex) return;
			console.log('new index', closestIndex, count++);
			const newTabsOrder = [...tabsOrder];
			newTabsOrder.splice(currentIndex, 1);
			newTabsOrder.splice(closestIndex, 0, rootNode.id);
			tabsOrder = newTabsOrder;
			isWaitingForFlip = true;

			setTimeout(() => {
				isWaitingForFlip = false;
			}, flipDuration);
		},
		onDragEnd(data) {}
	};

	let mainAddModel: AddModelProps | undefined;

	$: if ($tabSet === undefined && tabs.size > 0) {
		console.log('setting tabset');
		$tabSet = tabs.keys().next().value;
	}
	type Point = { x: number; y: number };
	let addButtonSet: string | undefined = undefined;
	let addButton: HTMLElement | undefined = undefined;
	$: if (addButtonSet !== undefined) addButtonSet = undefined;
	const drag: Action<
		HTMLElement,
		{
			dragDelay?: number;
			minRadius?: number;
			target?: HTMLElement;
			onDragStart?: (event: DragEventData) => void;
			onDragEnd?: (event: DragEventData) => void;
			onDrag?: (data: DragEventData) => void;
		}
	> = (node, params) => {
		let startDownTime = 0;
		let startDragTime = 0;
		let potentialDrag = false;
		let isDragging = false;
		node.classList.add('mydrag');

		let startPos: Point = { x: 0, y: 0 };
		let lastDragTime = 0;

		const { minRadius = 1 } = params;
		let target: HTMLElement | undefined = params.target;
		let axis: 'x' | 'y' | undefined = 'x';

		node.addEventListener('mousedown', (event) => {
			startDownTime = Date.now();
			startPos = { x: event.clientX, y: event.clientY };
			potentialDrag = true;
		});

		node.addEventListener('mousemove', (event) => {
			if (!potentialDrag) return;
			if (Date.now() - startDownTime < (params.dragDelay ?? 100)) return;
			if (
				Math.sqrt(
					Math.pow(event.clientX - startPos.x, 2) + Math.pow(event.clientY - startPos.y, 2)
				) < minRadius
			)
				return;
			console.log('dragStart');
			isDragging = true;
			onDragStart(event);
		});
		document.addEventListener('mousemove', (event) => {
			if (!isDragging) return;
			if (Date.now() - lastDragTime < 10) return;
			lastDragTime = Date.now();
			onDrag(event);
		});
		document.addEventListener('mouseup', (event) => {
			potentialDrag = false;
			if (!isDragging) return;
			console.log('drag end');
			onDragEnd(event);
			isDragging = false;
		});

		function computeOffset(event: MouseEvent): Point {
			if (!addButton) throw new ErrorWNotif({ emessage: 'No addButton' });
			const mainButtonRect = addButton.getBoundingClientRect();
			return {
				x:
					axis === 'y'
						? 0
						: Math.min(
								Math.max(event.clientX, boundsRect.x + startPos.x - baseNodeRect.x),
								mainButtonRect.x - (baseNodeRect.x + baseNodeRect.width - startPos.x)
						  ) - startPos.x,
				y: axis === 'x' ? 0 : event.clientY - startPos.y
			};
		}
		function makeData(event: MouseEvent): DragEventData {
			const offset = computeOffset(event);
			return {
				offsetX: offset.x,
				offsetY: offset.y,
				currentNode: target,
				rootNode: node
			};
		}
		let boundsRect =
			node.parentElement?.getBoundingClientRect() ?? document.body.getBoundingClientRect();
		let baseNodeRect = node.getBoundingClientRect();
		let baseNodeOffset: Point = {
			x: baseNodeRect.x - boundsRect.x,
			y: baseNodeRect.y - boundsRect.y
		};

		function onDragStart(event: MouseEvent) {
			boundsRect =
				node.parentElement?.getBoundingClientRect() ?? document.body.getBoundingClientRect();
			baseNodeRect = node.getBoundingClientRect();
			baseNodeOffset = {
				x: baseNodeRect.x - boundsRect.x,
				y: baseNodeRect.y - boundsRect.y
			};
			node.classList.add('invisible');
			startDragTime = Date.now();
			if (params.onDragStart) params.onDragStart(makeData(event));
		}
		function onDragEnd(event: MouseEvent) {
			if (params.onDragEnd) params.onDragEnd(makeData(event));
			target = undefined;
			dragCloneProps = undefined;
			node.classList.remove('invisible');
		}
		function onDrag(event: MouseEvent) {
			const offset = computeOffset(event);

			if (target !== undefined) {
				target.style.transform = `translate3d(${baseNodeOffset.x + offset.x}px, ${
					baseNodeOffset.y + offset.y
				}px, 0px)`;
			}
			if (target !== undefined && params.onDrag && Date.now() - startDragTime > flipDuration)
				params.onDrag(makeData(event));
		}
		return {
			update(parameter) {
				target = parameter.target;
				if (!target) return;
				target.style.transitionProperty = 'transform';
				target.style.transitionDuration = '0ms';
				// target.style.transform = `translate3d(${baseNodeOffset.x}px, ${baseNodeOffset.y}px, 0px)`;
			}
		};
	};
</script>

<div out:fly={{ x: '-100%', duration: 400 }}>
	<TabGroup regionList={'overflow-x-visible overflow-y-hidden'} border="">
		<!-- <div
			class="contents"
			data-comment-use:dndzone={{ items: Array.from(tabs.values()), type: 'main-tab' }}
			data-comment-on:consider={handleDndConsider}
			data-comment-on:finalize={handleDndFinalize}
		> -->
		<!-- Drag Tab Clone -->
		{#if dragCloneProps}
			<div class="absolute group variant-soft-surface transition" bind:this={dragClone}>
				<Tab group={null} value={undefined} name={'drag-clone'}>
					{dragCloneProps.name}
				</Tab>
			</div>
		{/if}

		{#each tabsOrder as key, i (key)}
			<div
				id={key}
				class="h-full relative group"
				class:pointer-events-none={dragCloneProps !== undefined}
				in:fly={{ y: '100%' }}
				tabindex={i}
				role="button"
				animate:flip={{ duration: flipDuration }}
				on:dblclick={tabs.get(key)?.onDblClick}
				use:drag={{
					dragDelay: 100,
					onDragStart: (data) => {
						dragCloneProps = tabs.get(key);
						draggableTabOptions.onDragStart(data);
					},
					onDragEnd: (data) => {
						dragCloneProps = undefined;
						draggableTabOptions.onDragEnd(data);
					},
					onDrag: (data) => {
						draggableTabOptions.onDrag(data);
					},
					target: dragClone
				}}
			>
				<button
					type="button"
					class="absolute top-0.5 right-0.5 p-1 hidden group-hover:block rounded-token variant-soft-surface"
					on:click={() => {
						if (tabs.get(key)?.onClose) tabs.get(key).onClose();
						tabsContext.deleteTab(key);
					}}
				>
					<Fa icon={faTimes} size="xs" />
				</button>
				<Tab bind:group={$tabSet} value={key} name={tabs.get(key).name} regionTab="">
					{tabs.get(key)?.name}
				</Tab>
			</div>
		{/each}
		{#if mainAddModel}
			<div
				role="button"
				class="h-full"
				in:fly={{ y: '100%', delay: tabs.size * 60 }}
				out:fly={{ x: '-100%', duration: 400 }}
				bind:this={addButton}
			>
				<Tab
					on:click={mainAddModel.addModel}
					bind:group={addButtonSet}
					name="addTab"
					value={'mainAdd'}>+</Tab
				>
			</div>
		{/if}
	</TabGroup>
</div>
