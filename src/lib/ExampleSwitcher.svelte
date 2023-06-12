<script lang="ts">
    import {TabGroup, Tab} from '@skeletonlabs/skeleton'

    let tabSet: number = 0;
</script>

<TabGroup>
    <Tab bind:group={tabSet} name="tab1" value={0}>Tab 1</Tab>
    <Tab bind:group={tabSet} name="tab2" value={1}>Tab 2</Tab>
    <Tab bind:group={tabSet} name="tab3" value={2}>Tab 3</Tab>
</TabGroup>
