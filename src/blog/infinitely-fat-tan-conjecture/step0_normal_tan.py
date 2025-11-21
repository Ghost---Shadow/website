#!/usr/bin/env python3
"""
Step 0: Normal tan function
Shows the regular periodic tan function with its characteristic jumps
"""

import numpy as np
import matplotlib.pyplot as plt
import os

# Set up the figure
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 5))

# Step 0: Normal tan function
x = np.linspace(-2 * np.pi, 2 * np.pi, 1000)
y_tan = np.tan(x)

# Handle discontinuities by setting large values to NaN
y_tan_clean = np.where(np.abs(y_tan) > 10, np.nan, y_tan)

# Left plot: Regular tan
ax1.plot(x, y_tan_clean, "b:", linewidth=2, label="tan(x)")
ax1.axhline(y=0, color="k", linestyle="-", alpha=0.3, linewidth=0.5)
ax1.axvline(x=0, color="k", linestyle="-", alpha=0.3, linewidth=0.5)

# Add vertical lines at discontinuities
for k in range(-2, 3):
    x_disc = (k + 0.5) * np.pi
    if -2 * np.pi <= x_disc <= 2 * np.pi:
        ax1.axvline(x=x_disc, color="r", linestyle="--", alpha=0.5, linewidth=1)

ax1.set_xlim(-2 * np.pi, 2 * np.pi)
ax1.set_ylim(-5, 5)
ax1.set_xlabel("x", fontsize=12)
ax1.set_ylabel("y", fontsize=12)
ax1.set_title("Step 0: Normal tan(x)\nPeriod = π, Multiple oscillations", fontsize=14)
ax1.grid(True, alpha=0.3)
ax1.legend()

# Add π markers on x-axis
pi_ticks = [-2 * np.pi, -np.pi, 0, np.pi, 2 * np.pi]
pi_labels = ["-2π", "-π", "0", "π", "2π"]
ax1.set_xticks(pi_ticks)
ax1.set_xticklabels(pi_labels)

# Right plot: Show -arccoth for comparison
# arccoth is defined for |x| > 1, so we plot two branches
x_arccoth_pos = np.linspace(1.1, 2 * np.pi, 500)
y_arccoth_pos = -np.arctanh(1 / x_arccoth_pos)  # arccoth(x) = arctanh(1/x)

x_arccoth_neg = np.linspace(-2 * np.pi, -1.1, 500)
y_arccoth_neg = -np.arctanh(1 / x_arccoth_neg)

ax2.plot(x_arccoth_pos, y_arccoth_pos, "g:", linewidth=2, label="-arccoth(x)")
ax2.plot(x_arccoth_neg, y_arccoth_neg, "g:", linewidth=2)
ax2.axhline(y=0, color="k", linestyle="-", alpha=0.3, linewidth=0.5)
ax2.axvline(x=0, color="k", linestyle="-", alpha=0.3, linewidth=0.5)
ax2.axvline(
    x=1, color="r", linestyle="--", alpha=0.5, linewidth=1, label="Singularity at x=±1"
)
ax2.axvline(x=-1, color="r", linestyle="--", alpha=0.5, linewidth=1)

ax2.set_xlim(-2 * np.pi, 2 * np.pi)
ax2.set_ylim(-5, 5)
ax2.set_xlabel("x", fontsize=12)
ax2.set_ylabel("y", fontsize=12)
ax2.set_title("Target: -arccoth(x)\nNon-periodic, Single branch", fontsize=14)
ax2.grid(True, alpha=0.3)
ax2.legend()

# Add π markers on x-axis to match left plot
ax2.set_xticks(pi_ticks)
ax2.set_xticklabels(pi_labels)

plt.suptitle(
    "Step 0: Starting Point - Normal tan vs Target -arccoth",
    fontsize=16,
    fontweight="bold",
)
plt.tight_layout()

# Save to the same directory as the script
script_dir = os.path.dirname(os.path.abspath(__file__))
output_path = os.path.join(script_dir, "step0_normal_tan.png")
plt.savefig(output_path, dpi=100, bbox_inches="tight")
plt.close()

print("Step 0: Normal tan function")
print("-" * 50)
print("Left plot: tan(x) with period π")
print("  - Multiple oscillations visible")
print("  - Jumps from +∞ to -∞ at odd multiples of π/2")
print("  - Periodic: Pattern repeats every π units")
print()
print("Right plot: -arccoth(x) (our target)")
print("  - Non-periodic: Never repeats")
print("  - Single branch from -∞ to 0")
print("  - Logarithmic singularity at x=1")
print()
print("Challenge: How do we transform the periodic tan into non-periodic -arccoth?")
print("Answer: Stretch by 2∞ and shift by 1∞!")
