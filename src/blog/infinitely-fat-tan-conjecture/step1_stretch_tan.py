#!/usr/bin/env python3
"""
Step 1: Stretch tan by 2-infinity
Shows how stretching the period makes tan look less oscillatory
"""

import numpy as np
import matplotlib.pyplot as plt
import os

# Set up the figure
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Different values of P (stretching factor)
P_values = [1, 3, 10, 100]
x_range = 10

for idx, P in enumerate(P_values):
    ax = axes[idx // 2, idx % 2]

    # Create x values centered at 0
    x = np.linspace(-x_range, x_range, 2000)

    # Stretched tan: tan(x/(2P))
    # Period is now 2πP instead of π
    y_tan = np.tan(x / (2 * P))

    # Handle discontinuities
    y_tan_clean = np.where(np.abs(y_tan) > 10, np.nan, y_tan)

    # Plot stretched tan
    ax.plot(x, y_tan_clean, "b:", linewidth=2, label=f"tan(x/{2*P})")

    # Mark discontinuities
    # Discontinuities occur when x/(2P) = (k + 0.5)π
    # So x = 2P(k + 0.5)π
    for k in range(-int(x_range / (P * np.pi)) - 1, int(x_range / (P * np.pi)) + 2):
        x_disc = 2 * P * (k + 0.5) * np.pi
        if -x_range <= x_disc <= x_range:
            ax.axvline(x=x_disc, color="r", linestyle="--", alpha=0.5, linewidth=0.5)
            if P <= 10:  # Only label for smaller P values
                ax.text(
                    x_disc,
                    ax.get_ylim()[1] * 0.8,
                    f"{k+0.5}π",
                    rotation=90,
                    fontsize=8,
                    alpha=0.7,
                )

    # Also plot -arccoth for reference (both branches)
    # arccoth is defined for |x| > 1
    x_arccoth_pos = np.linspace(1.1, x_range, 500)
    y_arccoth_pos = -np.arctanh(1 / x_arccoth_pos)
    ax.plot(x_arccoth_pos, y_arccoth_pos, "g--", linewidth=1, alpha=0.5, label="-arccoth(x)")

    x_arccoth_neg = np.linspace(-x_range, -1.1, 500)
    y_arccoth_neg = -np.arctanh(1 / x_arccoth_neg)
    ax.plot(x_arccoth_neg, y_arccoth_neg, "g--", linewidth=1, alpha=0.5)

    ax.axhline(y=0, color="k", linestyle="-", alpha=0.3, linewidth=0.5)
    ax.axvline(x=0, color="k", linestyle="-", alpha=0.3, linewidth=0.5)

    ax.set_xlim(-x_range, x_range)
    ax.set_ylim(-5, 5)
    ax.set_xlabel("x", fontsize=10)
    ax.set_ylabel("y", fontsize=10)

    period = 2 * np.pi * P
    if P == 100:
        ax.set_title(
            f"P = {P}: Period = 2π×{P} ≈ {period:.0f}\n(Approaching 2∞)", fontsize=11
        )
    else:
        ax.set_title(f"P = {P}: Period = 2π×{P} ≈ {period:.1f}", fontsize=11)

    ax.grid(True, alpha=0.3)
    ax.legend(loc="upper right", fontsize=9)

plt.suptitle(
    "Step 1: Stretching tan by 2-infinity (increasing P)",
    fontsize=16,
    fontweight="bold",
)
plt.tight_layout()

# Save to the same directory as the script
script_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(script_dir, "step1_stretch_tan.png")
plt.savefig(output_path, dpi=100, bbox_inches="tight")
plt.close()

print("Step 1: Stretching tan by 2-infinity")
print("-" * 50)
print("As P increases:")
print("  - Period changes from π to 2πP (approaching 2∞)")
print("  - Function tan(x/(2P)) oscillates more slowly")
print("  - Fewer complete oscillations visible in any finite window")
print()
print("Key observations:")
print("  - P = 1: Multiple oscillations (normal tan behavior)")
print("  - P = 3: Fewer oscillations visible")
print("  - P = 10: Even fewer oscillations")
print("  - P = 100: Almost no complete oscillation in view!")
print("  - P → ∞: Would show NO complete oscillation (period = 2∞)")
print()
print("Notice: The stretched tan still starts at 0 and goes up.")
print("       It doesn't match -arccoth yet (green dashed line).")
print("       We need Step 2: Shift by 1∞!")
