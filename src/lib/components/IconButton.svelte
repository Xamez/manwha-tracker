<script lang="ts">
  import { renderIcon, type IconName } from "$lib/icons";

  interface Props {
    icon: IconName;
    onclick?: () => void;
    href?: string;
    title?: string;
    ariaLabel?: string;
    textColor?: string;
    bgColor?: string;
    hoverBgColor?: string;
    disabled?: boolean;
    size?: "sm" | "md" | "lg";
  }

  let {
    icon,
    onclick,
    href,
    title = "",
    ariaLabel = title,
    textColor = "text-blue-400",
    bgColor = "bg-blue-900/20",
    hoverBgColor = "hover:bg-blue-900/30",
    disabled = false,
    size = "md",
  }: Props = $props();

  const sizeClasses = {
    sm: "w-7 h-7",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  const iconSizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const baseClasses = `p-2 rounded-lg transition-all hover:scale-105 focus:outline-none flex items-center justify-center ${sizeClasses[size]}`;
  const colorClasses = `${textColor} ${bgColor} ${hoverBgColor}`;
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer";
</script>

{#if href}
  <a
    {href}
    class="{baseClasses} {colorClasses} {disabledClasses} no-underline"
    {title}
    aria-label={ariaLabel}
    tabindex={disabled ? -1 : 0}
  >
    {@html renderIcon(icon, iconSizeClasses[size])}
  </a>
{:else}
  <button
    {onclick}
    class="{baseClasses} {colorClasses} {disabledClasses}"
    {title}
    aria-label={ariaLabel}
    {disabled}
    type="button"
  >
    {@html renderIcon(icon, iconSizeClasses[size])}
  </button>
{/if}
