# [LeanCoin: Proposal](https://claude.ai/share/a604b593-f5c3-4bab-b48c-37ed0cd7188c)

Nov 23, 2026

## Summary

LeanCoin is a proposed blockchain whose token pays for machine-checked mathematics instead of burning energy on hashes. It keeps security and usefulness apart: ordinary consensus secures the ledger, and the Lean 4 kernel settles a market of proof bounties.

- **Separate security from usefulness.** Consensus runs on a conventional mechanism (proof of stake as the baseline). Proofs do not secure the chain, so useful work cannot weaken it.
- **The Lean kernel is the judge.** A bounty pays out when a submitted proof term type-checks against the posted statement. No committee decides who earned it.
- **Contracts carry proofs.** Smart contracts are written in Lean and ship with machine-checked specifications, so the chain can verify correctness claims before it runs them.

## Problem

Hash-based proof of work is secure because its work is costly, unforgeable and worthless afterward, so an attacker cannot recoup the cost. Making the work useful breaks that logic, and theorems make poor puzzles for four reasons.

1. **Useful output offsets attack cost.** If the proofs are worth something outside the chain, an attacker can sell them and attack more cheaply.
2. **Proof search is not progress-free.** Any miner with a hash function has a chance each round. With theorems, the best prover wins almost every time, which centralizes mining.
3. **Difficulty cannot be tuned.** Bitcoin retargets by adding a zero. No equivalent exists for making a theorem 10% harder.
4. **Someone has to supply the problems.** Miners who pick their own pick easy ones. A committee that picks them is a trusted party. Unpredictability is also needed, or problems get pre-solved.

LeanCoin's answer is to stop asking proofs to secure the chain. Proofs get their own market, and security stays with a mechanism built for it.

## Design overview

LeanCoin has two layers: a conventional consensus layer that secures the ledger, and a Lean layer where the kernel settles bounties and contracts.

&#91;embedded content: two layers · 7 parts\]

Validators run the kernel on every revealed proof and contract spec, and the consensus layer only records the results, so proof difficulty never affects block production.

## Proof bounty market

Anyone can post a Lean statement with a token reward, and the first valid proof collects it. The kernel decides validity, so payout needs no human judge.

1. **Post.** A sponsor submits a Lean statement (a `theorem` type, with its definitions) and escrows the reward on chain.
2. **Commit.** A prover publishes a hash of the proof bound to their own address, which prevents front-running.
3. **Reveal.** After a short delay the prover reveals the proof term. Validators run the Lean kernel on it.
4. **Pay.** If the term type-checks against the posted statement and uses no unapproved axioms, escrow releases to the prover.

The design has to handle three known hazards:

- **Wrong statements.** The kernel proves what was written, not what the sponsor meant. Bounties therefore carry a review window where anyone can flag a statement as vacuous, trivially false or mis-specified before the reward unlocks.
- **Cheating via axioms.** Payout is checked against an allow-list of axioms (for example the standard Lean ones), and `sorry` is rejected.
- **Duplicate effort.** First valid reveal wins. Sponsors can optionally split a reward across milestones (lemmas) to let provers collaborate.

## Lean smart contracts

Contracts are Lean programs that deploy together with a machine-checked specification, and the chain verifies the proof at deployment.

- **Language.** Contracts use a restricted, deterministic subset of Lean 4: pure functions, with effects limited to explicit state-transition calls.
- **Spec and proof ship with the code.** A deployment includes the contract, a statement of its invariants (for example, total supply is conserved), and the proof. Validators check it once, at deploy time, with the kernel.
- **Metering.** Execution is metered to bound cost, and the kernel check is priced by proof size so that deploying a huge proof cannot be used to stall validators.
- **What it guarantees.** A verified contract meets its stated spec. It does not guarantee the spec is the right one, so the spec is published and readable next to the code.

This part is optional for the bounty market to work. It is the second use of the same kernel.

## Token and incentives

The LeanCoin token (LEAN) does three jobs: it stakes the consensus layer, pays transaction fees, and funds bounties. Value reaches provers only because someone chose to pay for a proof.

| Flow | Who pays | Who receives |
| --- | --- | --- |
| Consensus rewards | Protocol issuance and fees | Stakers and validators |
| Proof bounties | Sponsors (individuals, labs, DAOs, grant programs) | The first prover with a valid proof |
| Contract deployment | Developers | Validators (for kernel checking) |
| Bounty review | A small share of each bounty | Reviewers who flag bad statements |

Supply, issuance rate and fee split are open parameters, listed under open questions. Two design rules are fixed: bounty money is never minted to pay provers, so proofs cannot dilute holders, and a share of fees can seed a public pool for formalization goals the community votes on.

## Risks and mitigations

The largest risk is proving the wrong thing, not breaking the chain.

| Risk | How it bites | Mitigation |
| --- | --- | --- |
| Wrong or vacuous spec | A proof checks but the statement did not mean what the sponsor wanted | Review window before payout, published specs, reviewer rewards |
| Kernel or checker bug | An invalid proof is accepted | Small trusted kernel, multiple independent implementations of the check, client diversity |
| Prover centralization | A few strong provers take most bounties | Keep proofs out of consensus; milestone bounties that split work |
| Validator DoS via huge proofs | Checking a proof stalls the network | Price kernel checks by proof size, cap per-block checking |
| Bounty gaming | Sponsor and prover collude to launder tokens | Reviewer flags, escrow delays, no minting against bounties |
| Front-running | Someone copies a revealed proof | Commit-reveal bound to the prover's address |
| Regulatory | Token classification varies by jurisdiction | Legal review before any sale; this proposal takes no position |

## Roadmap

LeanCoin moves through four phases, and each gate must clear before the next phase starts. Phases are not drawn to scale, and dates are left open until the research phase settles the cost model.

&#91;embedded content: roadmap · 4 phases, 3 gates\]

The first gate fixes the open parameters, the second proves the bounty market on a test network, and the third requires an outside audit before any mainnet launch.

## Open questions

- [ ] Which consensus mechanism is the baseline: proof of stake, or a conventional hash-based PoW chain?
- [ ] How is a statement's quality judged? Reviewer staking, a curated allow-list, or both?
- [ ] Which Lean subset is deterministic and cheap enough for contract execution?
- [ ] What is the right pricing for kernel checking by proof size?
- [ ] Who seeds the first bounties: a foundation, labs, or the Lean community?
- [ ] Supply, issuance rate and fee split are undecided.
- [ ] Should reviewed theorems feed back into Mathlib, and under what license?
