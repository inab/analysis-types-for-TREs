import {html} from "npm:htl";
import * as Inputs from "npm:@observablehq/inputs";
import {marked} from "marked";
import markedKatex from "marked-katex-extension";
import { htmlUnsafe } from "./html-unsafe.js";

const options = {
  throwOnError: false
};

marked.use(markedKatex(options));

function getSeparabilityColor(sep) {
  const colors = {
    "fully": "#10b981",
    "iterative": "#EE7326",
    "none": "#ef4444"
  };
  return colors[sep] || "#6b7280";
}

function getSeparabilityString(sep) {
  const strs = {
    "fully": "Fully separable",
    "iterative": "Iteratively separable",
    "none": "Non-separable"
  };
  return strs[sep] || "Unknown separability";
}

function getPrivacyBadge(level) {
  const colors = {
    "required": "#dc2626",
    "compatible": "#059669",
    "none": "#9ca3af"
  };
  const labels = {
    "required": "Required",
    "compatible": "Compatible",
    "none": "Not supported"
  };
  return {color: colors[level] || "#9ca3af", label: labels[level] || level};
}

export class Statistic {
  constructor(statisticField) {
    this.statisticId = statisticField.statistic_id;
    this.description = statisticField.description;
    this.output = statisticField.output;
    this.statbarnId = statisticField.statbarn_id;
    this.mathjax = statisticField.mathjax;
    this.notes = statisticField.notes;
  }

  addAliases(aliasList) {
    this.aliases = aliasList.filter(a => a.statistic_id === this.statisticId);
    if (this.aliases.length > 0) {
      const primary_alias = this.aliases.filter(a => a.is_primary === "true");
      if (primary_alias.length > 0) {
        this.primary_alias = primary_alias[0];
      } else {
        this.primary_alias = this.aliases[0];
      }
    } else {
      this.primary_alias = {alias_name: this.statisticId};
    }
  }

  addAlgorithms(algorithmList) {
    this.algorithms = algorithmList.filter(a => a.statisticId === this.statisticId);
  }

  addRelationships(relationshipList) {
    this.relationships = relationshipList.filter(r => r.source_statistic_id === this.statisticId);
  }

  showAliases() {
    if (this.aliases.length > 1) {
      return html`
      <div style="
        background: #f9fafb;
        border-left: 3px solid #204f90;
        padding: 1rem;
        margin: 1rem 0;
        border-radius: 0.5rem;
      ">
        <h3 style="margin-top: 0; color: #1f2937; font-size: 0.95rem;">Also known as:</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${this.aliases.map(a => html`
            <span style="
              background: white;
              border: 1px solid #e5e7eb;
              padding: 0.25rem 0.75rem;
              border-radius: 1rem;
              font-size: 0.875rem;
              color: #374151;
              ${a.is_primary === "true" ? "font-weight: 600; border-color: #204f90; color: #3b82f6;" : ""}
            ">${a.alias_name}</span>
          `)}
        </div>
      </div>
      `
    } else {
      return ``
    }
  }

  showMetadata() {
    return html`
      <div style="
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1rem 0;
      ">
        <div style="
          background: #f2d6c2;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border-left: 3px solid #EE7326;
        ">
          <div style="font-size: 0.75rem; color: #92400e; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Output Type</div>
          <div style="font-size: 1rem; color: #78350f; font-weight: 500; margin-top: 0.25rem;">${this.output}</div>
          ${this.statbarnId ? html`
            <div style="font-size: 0.75rem; color: #92400e; margin-top: 0.5rem;">
              Statbarn: <span style="font-weight: 600;">${this.statbarnId}</span>
            </div>
          ` : ''}
        </div>
        <div style="
          background: #e0e7ff;
          padding: 0.75rem;
          border-radius: 0.5rem;
          border-left: 3px solid #204F90;
        ">
          <div style="font-size: 0.75rem; color: ##3f5f8c; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Algorithms</div>
          <div style="font-size: 1rem; color: ##22344d; font-weight: 500; margin-top: 0.25rem;">${this.algorithms.length} available</div>
        </div>
      </div>
    `;
  }

  showAlgorithms() {
    if (this.algorithms.length > 0) {
      return html`<div style="display: flex; flex-direction: column; gap: 1rem;">
        ${this.algorithms.map(a => a.display())}
      </div>`;
    } else {
      return html`<p style="color: #6b7280; font-style: italic;">No algorithms available</p>`;
    }
  }

  display() {
    return html`
    <div style="
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.75rem;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      margin-bottom: 1.5rem;
    ">
      <h1 style="
        margin: 0 0 0.5rem 0;
        color: #111827;
        font-size: 1.75rem;
        font-weight: 700;
      ">${this.primary_alias.alias_name}</h1>
      
      <p style="
        color: #6b7280;
        font-size: 1rem;
        line-height: 1.6;
        margin: 0.5rem 0 1rem 0;
      ">${this.description}</p>

      ${this.showMetadata()}
      ${this.showAliases()}
      
      ${this.notes ? html`
        <div style="
          background: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          margin: 1rem 0;
        ">
          <h3 style="margin-top: 0; color: #374151; font-size: 0.95rem;">Notes:</h3>
          <p style="margin: 0; color: #4b5563; font-size: 0.9rem;">${this.notes}</p>
        </div>
      ` : ''}

      <details style="margin-top: 1.5rem;">
        <summary style="
          cursor: pointer;
          color: #204f90;
          font-weight: 600;
          font-size: 1.1rem;
          padding: 0.75rem;
          background: #eff6ff;
          border-radius: 0.5rem;
          list-style: none;
        ">
          <span>▶ View ${this.algorithms.length} Algorithm${this.algorithms.length !== 1 ? 's' : ''}</span>
        </summary>
        <div style="margin-top: 1rem; padding: 0 0.5rem;">
          ${this.showAlgorithms()}
        </div>
      </details>
    </div>
    `
  }
}

export class Algorithm {
  constructor(algorithmField) {
    this.algorithmId = algorithmField.algorithm_id;
    this.statisticId = algorithmField.statistic_id;
    this.name = algorithmField.name;
    this.description = algorithmField.description;
    this.separability = algorithmField.separability;
    this.mathjax = algorithmField.mathjax;
    this.communicationRounds = algorithmField.communication_rounds;
    this.adaptiveRounds = algorithmField.adaptive_rounds === "true";
    this.communicationDirection = algorithmField.communication_direction.replaceAll("_", " ");
    this.requiresBranching = algorithmField.requires_branching === "true";
    this.requiresPersistence = algorithmField.requires_persistence === "true";
    this.differentialPrivacy = algorithmField.differential_privacy;
    this.homomorphicEncryption = algorithmField.homomorphic_encryption;
    this.multipartyComputation = algorithmField.multiparty_computation;
    this.computationalComplexity = algorithmField.computational_complexity;
    this.communicationComplexity = algorithmField.communication_complexity;
    this.notes = algorithmField.notes;
  }

  addObservables(observableDataList) {
    this.observables = observableDataList.filter(o => o.algorithm_id === this.algorithmId)
  }

  showObservables() {
    if (!this.observables || this.observables.length === 0) {
      return html`<p style="color: #9ca3af; font-style: italic; font-size: 0.875rem;">No observable data defined</p>`;
    }
    
    return Inputs.table(
      this.observables.map(d => {
        return {
          "Node Type": d.node_type,
          "Observable Item": d.item,
          "Description": d.description,
        }
      }),
      {layout: "auto", width: "100%"}
    );
  }

  showPrivacyFeatures() {
    const features = [];
    
    if (this.differentialPrivacy && this.differentialPrivacy !== "none") {
      features.push({name: "Differential Privacy", value: this.differentialPrivacy, type: "privacy"});
    }
    if (this.homomorphicEncryption && this.homomorphicEncryption !== "none") {
      features.push({name: "Homomorphic Encryption", value: this.homomorphicEncryption, type: "encryption"});
    }
    if (this.multipartyComputation && this.multipartyComputation !== "none") {
      features.push({name: "Multiparty Computation", value: this.multipartyComputation, type: "mpc"});
    }

    if (features.length === 0) return '';

    return html`
      <div style="margin: 1rem 0;">
        <h4 style="color: #374151; font-size: 0.9rem; margin-bottom: 0.5rem;">Privacy & Security Features</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
          ${features.map(f => {
            const badge = getPrivacyBadge(f.value);
            return html`
              <div style="
                background: ${badge.color}15;
                border: 1px solid ${badge.color};
                padding: 0.5rem 0.75rem;
                border-radius: 0.5rem;
                font-size: 0.8rem;
              ">
                <div style="font-weight: 600; color: ${badge.color};">${f.name}</div>
                <div style="color: #4b5563; margin-top: 0.125rem;">${badge.label}</div>
              </div>
            `;
          })}
        </div>
      </div>
    `;
  }

  showComplexity() {
    if (!this.computationalComplexity && !this.communicationComplexity) return '';

    return html`
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
        margin: 1rem 0;
      ">
        ${this.computationalComplexity ? html`
          <div style="
            background: #fef2f2;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            border-left: 3px solid #ef4444;
          ">
            <div style="font-size: 0.7rem; color: #991b1b; font-weight: 600; text-transform: uppercase;">Computational</div>
            <div style="font-size: 0.9rem; color: #7f1d1d; font-family: monospace; margin-top: 0.25rem;">${this.computationalComplexity}</div>
          </div>
        ` : ''}
        ${this.communicationComplexity ? html`
          <div style="
            background: #f0fdf4;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            border-left: 3px solid #22c55e;
          ">
            <div style="font-size: 0.7rem; color: #166534; font-weight: 600; text-transform: uppercase;">Communication</div>
            <div style="font-size: 0.9rem; color: #14532d; font-family: monospace; margin-top: 0.25rem;">${this.communicationComplexity}</div>
          </div>
        ` : ''}
      </div>
    `;
  }

  display() {
    return html`
    <div style="
      background: #fafafa;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      padding: 1.25rem;
    ">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.75rem;">
        <h3 style="margin: 0; color: #1f2937; font-size: 1.25rem;">${this.name}</h3>
        <span style="
          background: ${getSeparabilityColor(this.separability)};
          color: white;
          padding: 0.375rem 0.75rem;
          border-radius: 0.375rem;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        ">
          ${getSeparabilityString(this.separability)}
        </span>
      </div>
      
      <p style="color: #4b5563; margin: 0.5rem 0 1rem 0; font-size: 0.95rem;">${this.description}</p>

      ${htmlUnsafe(marked.parse(this.mathjax))}

      <div style="
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0.75rem 0;
      ">
        <span style="
          background: #dbeafe;
          color: #1e40af;
          padding: 0.25rem 0.625rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
          font-weight: 500;
        ">
          ${this.adaptiveRounds ? 'Adaptive rounds' : `${this.communicationRounds || 'N/A'} round${this.communicationRounds !== 1 ? 's' : ''}`}
        </span>
        <span style="
          background: #f3e8ff;
          color: #6b21a8;
          padding: 0.25rem 0.625rem;
          border-radius: 0.25rem;
          font-size: 0.8rem;
          font-weight: 500;
        ">
          ${this.communicationDirection}
        </span>
        ${this.requiresBranching ? html`
          <span style="
            background: #fee2e2;
            color: #991b1b;
            padding: 0.25rem 0.625rem;
            border-radius: 0.25rem;
            font-size: 0.8rem;
            font-weight: 500;
          ">Requires branching</span>
        ` : ''}
        ${this.requiresPersistence ? html`
          <span style="
            background: #ffedd5;
            color: #9a3412;
            padding: 0.25rem 0.625rem;
            border-radius: 0.25rem;
            font-size: 0.8rem;
            font-weight: 500;
          ">Requires persistence</span>
        ` : ''}
      </div>

      ${this.showComplexity()}
      ${this.showPrivacyFeatures()}

      <h4 style="color: #374151; font-size: 0.9rem; margin: 1rem 0 0.5rem 0;">Observable Data</h4>
      ${this.showObservables()}

      ${this.notes ? html`
        <div style="
          background: white;
          padding: 1rem;
          border-radius: 0.5rem;
          margin-top: 1rem;
          border-left: 3px solid #8b5cf6;
        ">
          <h4 style="margin-top: 0; color: #6b21a8; font-size: 0.9rem;">Implementation Notes</h4>
          <div style="color: #4b5563; font-size: 0.875rem; line-height: 1.6;">
            ${htmlUnsafe(marked.parse(this.notes))}
          </div>
        </div>
      ` : ''}
    </div>
    `
  }
}
