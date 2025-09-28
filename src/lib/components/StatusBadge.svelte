<script lang="ts">
  import { formatManwhaStatus } from "$lib/types.ts";
  import type { ManwhaStatus } from "$lib/types.ts";

  interface Props {
    status: ManwhaStatus;
  }

  let { status }: Props = $props();
</script>

<span
  class="status-badge"
  class:reading={status === "reading"}
  class:completed={status === "completed"}
  class:to-continue={status === "to-continue"}
  class:abandoned={status === "abandoned"}
  class:ended={status === "ended"}
>
  {formatManwhaStatus(status)}
</span>

<style>
  @reference "tailwindcss";

  .status-badge {
    @apply px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide;
  }

  .status-badge.reading {
    @apply bg-green-900/30 text-green-400 border border-green-700;
  }

  .status-badge.completed {
    @apply bg-blue-900/30 text-blue-400 border border-blue-700;
  }

  .status-badge.to-continue {
    @apply bg-yellow-900/30 text-yellow-400 border border-yellow-700;
  }

  .status-badge.abandoned {
    @apply bg-red-900/30 text-red-400 border border-red-700;
  }

  .status-badge.ended {
    @apply bg-purple-900/30 text-purple-400 border border-purple-700;
  }
</style>
