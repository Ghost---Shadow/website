#!/usr/bin/env python3
"""
Step 2: Shift by 1-infinity
Shows how shifting by P (half the 2∞ period) creates the final transformation
"""

import numpy as np
import matplotlib.pyplot as plt
import os

# Set up the figure - 3 subplots now
fig, axes = plt.subplots(1, 3, figsize=(20, 5))

# Use P = π/2 for first two plots (x/π), P = π for third plot (x/2π)
P_values = [np.pi/2, np.pi/2, np.pi]

x_range = 10

for idx, P in enumerate(P_values):
    ax = axes[idx]

    # Create x values centered at 0
    x = np.linspace(-x_range, x_range, 2000)

    # First plot: phase 0 (no shift), Second and third plots: with shift of π/2
    if idx == 0:
        # Phase 0: just stretched, no shift
        argument = x / (2 * P)
        shift_amount = 0
    else:
        # With shift of π/2
        shift_amount = np.pi / 2
        argument = x / (2 * P) - shift_amount

    y_tan_shifted = np.tan(argument)

    # Handle discontinuities
    y_tan_shifted_clean = np.where(np.abs(y_tan_shifted) > 10, np.nan, y_tan_shifted)

    # Plot the transformed tan (dotted line)
    if idx == 0:
        ax.plot(x, y_tan_shifted_clean, "b:", linewidth=2, label="tan(x/π)")
    elif idx == 1:
        ax.plot(x, y_tan_shifted_clean, "b:", linewidth=2, label="tan(x/π - π/2)")
    else:
        ax.plot(x, y_tan_shifted_clean, "b:", linewidth=2, label="tan(x/2π - π/2)")

    # Plot -arccoth(x) - unchanged throughout, both branches, dotted
    # Positive branch
    x_arccoth_pos = np.linspace(1.1, x_range, 500)
    y_arccoth_pos = -np.arctanh(1 / x_arccoth_pos)  # -arccoth(x)
    ax.plot(
        x_arccoth_pos, y_arccoth_pos, "g:", linewidth=2, alpha=0.7, label="-arccoth(x)"
    )

    # Negative branch
    x_arccoth_neg = np.linspace(-x_range, -1.1, 500)
    y_arccoth_neg = -np.arctanh(1 / x_arccoth_neg)
    ax.plot(x_arccoth_neg, y_arccoth_neg, "g:", linewidth=2, alpha=0.7)

    # Mark -arccoth singularities at ±1 (always the same)
    ax.axvline(
        x=1,
        color="g",
        linestyle="--",
        alpha=0.5,
        linewidth=1,
        label="-arccoth undefined at x=±1",
    )
    ax.axvline(x=-1, color="g", linestyle="--", alpha=0.5, linewidth=1)

    # Styling
    ax.axhline(y=0, color="k", linestyle="-", alpha=0.3, linewidth=0.5)
    ax.axvline(x=0, color="k", linestyle="-", alpha=0.3, linewidth=0.5)

    ax.set_xlim(-x_range, x_range)
    ax.set_ylim(-2, 2)  # Center at 0,0
    ax.set_xlabel("x", fontsize=10)
    ax.set_ylabel("y", fontsize=10)

    # Title explaining the transformation
    if idx == 0:
        ax.set_title(
            f"Stretched: tan(x/π), Phase 0 (no shift)\n"
            + f"Period = π²",
            fontsize=11,
        )
    elif idx == 1:
        ax.set_title(
            f"Stretched: tan(x/π), Shifted by π/2\n"
            + f"Period = π², Phase shift = π/2",
            fontsize=11,
        )
    else:
        ax.set_title(
            f"Stretched: tan(x/2π), Shifted by π/2\n"
            + f"Period = 2π², Phase shift = π/2",
            fontsize=11,
        )
        # Add disclaimer text
        ax.text(
            0.5, -0.15,
            "⚠ Illustrative only: Cannot numerically plot tan at infinities.\n"
            "True convergence requires 2P → 2∞ and shift P → 1∞.",
            transform=ax.transAxes,
            fontsize=9,
            ha='center',
            va='top',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.3)
        )

    ax.grid(True, alpha=0.3)
    ax.legend(loc="lower right", fontsize=8)

plt.suptitle(
    "Step 2: Complete Transformation - Stretch by 2∞ AND Shift by 1∞",
    fontsize=16,
    fontweight="bold",
)
plt.tight_layout()

# Save to the same directory as the script
script_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(script_dir, "step2_shift_transform.png")
plt.savefig(output_path, dpi=100, bbox_inches="tight")
plt.close()

print("Step 2: The Complete Transformation")
print("-" * 50)
print("Formula: tan(x/(2P) - P) where:")
print("  - x/(2P): Stretches by factor of 2P (making period = 2πP)")
print("  - -P: Shifts by P (which is half the stretched period)")
print()
print("As P increases:")
print("  - P = 3: Some resemblance to -arccoth emerging")
print("  - P = 10: Better match in shape")
print("  - P = 30: Very good correspondence")
print("  - P = 100: Nearly identical to -arccoth!")
print("  - P → ∞: Perfect match (in the limit)")
print()
print("The Portal Effect:")
print("  - We stretched tan's period to 2∞")
print("  - We shifted by 1∞ (half the period)")
print("  - Now we're 'looking at our back through a portal'")
print("  - The result: A single non-repeating branch that matches -arccoth!")
print()
print("Note: The exact relationship between P and a (the scaling in -arccoth(x/a))")
print("      requires further investigation. Here we used a ≈ P for visualization.")
