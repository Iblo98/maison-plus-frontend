'use client';
import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { Calculator, TrendingDown, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function SimulationCredit() {
  const [form, setForm] = useState({
    prix_bien: '',
    apport: '',
    taux_interet: '8',
    duree_ans: '20'
  });
  const [resultat, setResultat] = useState(null);

  useEffect(() => {
    if (form.prix_bien && form.duree_ans && form.taux_interet) {
      calculer();
    }
  }, [form]);

  const calculer = () => {
    const prix = parseFloat(form.prix_bien) || 0;
    const apport = parseFloat(form.apport) || 0;
    const taux = parseFloat(form.taux_interet) / 100 / 12;
    const duree = parseInt(form.duree_ans) * 12;

    if (prix <= 0 || duree <= 0) return;

    const montantEmprunte = prix - apport;
    if (montantEmprunte <= 0) {
      setResultat({
        mensualite: 0,
        montant_emprunte: 0,
        cout_total: prix,
        cout_interets: 0,
        apport_pct: 100
      });
      return;
    }

    let mensualite;
    if (taux === 0) {
      mensualite = montantEmprunte / duree;
    } else {
      mensualite = montantEmprunte * (taux * Math.pow(1 + taux, duree)) / (Math.pow(1 + taux, duree) - 1);
    }

    const coutTotal = mensualite * duree;
    const coutInterets = coutTotal - montantEmprunte;
    const apportPct = (apport / prix) * 100;

    setResultat({
      mensualite: Math.round(mensualite),
      montant_emprunte: Math.round(montantEmprunte),
      cout_total: Math.round(coutTotal + apport),
      cout_interets: Math.round(coutInterets),
      apport_pct: Math.round(apportPct)
    });
  };

  const formaterPrix = (prix) => new Intl.NumberFormat('fr-FR').format(prix) + ' XOF';

  const tableauAmortissement = () => {
    if (!resultat || !form.prix_bien) return [];
    const prix = parseFloat(form.prix_bien);
    const apport = parseFloat(form.apport) || 0;
    const taux = parseFloat(form.taux_interet) / 100 / 12;
    const duree = parseInt(form.duree_ans) * 12;
    const montantEmprunte = prix - apport;
    const mensualite = resultat.mensualite;

    let solde = montantEmprunte;
    const tableau = [];

    for (let annee = 1; annee <= parseInt(form.duree_ans); annee++) {
      let capitalAnnee = 0;
      let interetsAnnee = 0;

      for (let mois = 0; mois < 12; mois++) {
        const interetsMois = solde * taux;
        const capitalMois = mensualite - interetsMois;
        capitalAnnee += capitalMois;
        interetsAnnee += interetsMois;
        solde -= capitalMois;
      }

      tableau.push({
        annee,
        capital: Math.round(capitalAnnee),
        interets: Math.round(interetsAnnee),
        solde: Math.max(0, Math.round(solde))
      });

      if (solde <= 0) break;
    }

    return tableau;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Calculator size={32} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Simulation de crédit</h1>
          <p className="text-gray-500">Calculez vos mensualités et planifiez votre achat immobilier</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Formulaire */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Paramètres du crédit</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prix du bien (XOF)
                  </label>
                  <input type="number" value={form.prix_bien}
                    onChange={(e) => setForm({...form, prix_bien: e.target.value})}
                    placeholder="Ex: 50000000"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                  {form.prix_bien && (
                    <p className="text-xs text-gray-400 mt-1">
                      = {formaterPrix(parseFloat(form.prix_bien) || 0)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Apport personnel (XOF)
                  </label>
                  <input type="number" value={form.apport}
                    onChange={(e) => setForm({...form, apport: e.target.value})}
                    placeholder="Ex: 10000000"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:border-blue-500 transition"
                  />
                  {form.apport && form.prix_bien && (
                    <p className="text-xs text-gray-400 mt-1">
                      = {Math.round((parseFloat(form.apport) / parseFloat(form.prix_bien)) * 100)}% du prix
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Taux d&apos;intérêt annuel : {form.taux_interet}%
                  </label>
                  <input type="range" min="1" max="20" step="0.5"
                    value={form.taux_interet}
                    onChange={(e) => setForm({...form, taux_interet: e.target.value})}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>1%</span>
                    <span>20%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Durée du crédit : {form.duree_ans} ans
                  </label>
                  <input type="range" min="5" max="30" step="1"
                    value={form.duree_ans}
                    onChange={(e) => setForm({...form, duree_ans: e.target.value})}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>5 ans</span>
                    <span>30 ans</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conseils */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-2">💡 Conseils</h3>
              <ul className="space-y-1 text-blue-700 text-sm">
                <li>• L&apos;apport idéal est de 20-30% du prix du bien</li>
                <li>• La mensualité ne doit pas dépasser 33% de vos revenus</li>
                <li>• Plus la durée est longue, plus vous payez d&apos;intérêts</li>
                <li>• Négociez le taux avec votre banque</li>
              </ul>
            </div>
          </div>

          {/* Résultats */}
          <div className="space-y-6">
            {resultat && form.prix_bien ? (
              <>
                {/* Mensualité */}
                <div className="bg-gradient-to-br from-green-500 to-green-700 text-white rounded-2xl p-6">
                  <p className="text-green-100 text-sm mb-1">Mensualité estimée</p>
                  <p className="text-4xl font-black">{formaterPrix(resultat.mensualite)}</p>
                  <p className="text-green-100 text-sm mt-1">par mois pendant {form.duree_ans} ans</p>

                  {/* Indicateur budget */}
                  <div className="mt-4 bg-white bg-opacity-20 rounded-xl p-3">
                    <p className="text-sm font-medium mb-1">Revenu mensuel recommandé :</p>
                    <p className="text-xl font-bold">
                      {formaterPrix(resultat.mensualite * 3)} minimum
                    </p>
                  </div>
                </div>

                {/* Récapitulatif */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-lg font-bold text-gray-800 mb-4">Récapitulatif</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Prix du bien', value: formaterPrix(parseFloat(form.prix_bien)), color: 'gray' },
                      { label: 'Apport personnel', value: formaterPrix(parseFloat(form.apport) || 0), color: 'green' },
                      { label: 'Montant emprunté', value: formaterPrix(resultat.montant_emprunte), color: 'blue' },
                      { label: 'Coût des intérêts', value: formaterPrix(resultat.cout_interets), color: 'orange' },
                      { label: 'Coût total', value: formaterPrix(resultat.cout_total), color: 'red', bold: true },
                    ].map((item) => (
                      <div key={item.label} className={`flex justify-between items-center py-2 ${item.bold ? 'border-t border-gray-100 pt-3' : ''}`}>
                        <span className="text-gray-600 text-sm">{item.label}</span>
                        <span className={`font-${item.bold ? 'black' : 'semibold'} ${
                          item.color === 'green' ? 'text-green-600' :
                          item.color === 'blue' ? 'text-blue-600' :
                          item.color === 'orange' ? 'text-orange-500' :
                          item.color === 'red' ? 'text-red-500' :
                          'text-gray-800'
                        }`}>
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Apport */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Apport ({resultat.apport_pct}%)</span>
                      <span>Crédit ({100 - resultat.apport_pct}%)</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                        style={{ width: `${resultat.apport_pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Tableau amortissement */}
                {tableauAmortissement().length > 0 && (
                  <div className="bg-white rounded-2xl shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <TrendingDown size={20} className="text-blue-600" />
                      Tableau d&apos;amortissement
                    </h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100">
                            <th className="text-left py-2 text-gray-500">Année</th>
                            <th className="text-right py-2 text-gray-500">Capital</th>
                            <th className="text-right py-2 text-gray-500">Intérêts</th>
                            <th className="text-right py-2 text-gray-500">Solde restant</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableauAmortissement().map((row) => (
                            <tr key={row.annee} className="border-b border-gray-50 hover:bg-gray-50">
                              <td className="py-2 font-medium">An {row.annee}</td>
                              <td className="py-2 text-right text-green-600">
                                {formaterPrix(row.capital)}
                              </td>
                              <td className="py-2 text-right text-orange-500">
                                {formaterPrix(row.interets)}
                              </td>
                              <td className="py-2 text-right text-blue-600 font-semibold">
                                {formaterPrix(row.solde)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <Calculator size={64} className="text-gray-200 mx-auto mb-4" />
                <p className="text-gray-500">Entrez le prix du bien pour voir votre simulation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}