"use client";

import { useEffect, useState } from "react";

interface InviteAcceptance {
  id: string;
  invite_id: string;
  guest_name: string;
  contact_info: string;
  invite_count: number;
  accepted_at: string;
}

export default function InvitesAdminPage() {
  const [invites, setInvites] = useState<InviteAcceptance[]>([]);
  const [totalConfirmations, setTotalConfirmations] = useState(0);
  const [totalAssistants, setTotalAssistants] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInvites = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/invites/list");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch invites");
      }

      setTotalConfirmations(data.totalConfirmations);
      setTotalAssistants(data.totalAssistants);
      setInvites(data.invites);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-mint-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl text-mint-900 mb-2">
            Panel de Invitaciones
          </h1>
          <p className="text-gray-600">Confirmaciones para XV Años de Aurora</p>
          <a
            href="/"
            className="inline-block mt-4 text-gold-600 hover:text-gold-700 text-sm"
          >
            ← Volver al inicio
          </a>
        </div>

        {/* Total Count - Large and Centered */}
        <div className="bg-white rounded-2xl shadow-xl p-12 mb-8 text-center border-t-4 border-gold-400">
          {loading ? (
            <div className="py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-mint-800 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando...</p>
            </div>
          ) : error ? (
            <div className="py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-red-900 mb-2">Error</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={fetchInvites}
                className="px-6 py-2 bg-mint-800 text-white rounded-lg hover:bg-mint-900 transition"
              >
                Reintentar
              </button>
            </div>
          ) : (
            <div>
              {/* Two Metrics Side by Side */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                {/* Confirmations */}
                <div className="text-center pb-8 md:pb-0 md:border-r-2 md:border-gold-200">
                  <p className="text-gray-500 uppercase tracking-widest text-xs mb-3">
                    Confirmaciones
                  </p>
                  <div className="font-serif text-6xl md:text-7xl text-mint-900 mb-2 font-bold">
                    {totalConfirmations}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {totalConfirmations === 1
                      ? "persona confirmó"
                      : "personas confirmaron"}
                  </p>
                </div>

                {/* Total Assistants */}
                <div className="text-center pt-8 md:pt-0 border-t-2 md:border-t-0 border-gold-200">
                  <p className="text-gray-500 uppercase tracking-widest text-xs mb-3">
                    Total Asistentes
                  </p>
                  <div className="font-serif text-6xl md:text-7xl text-gold-600 mb-2 font-bold">
                    {totalAssistants}
                  </div>
                  <p className="text-gray-600 text-sm">
                    {totalAssistants === 1 ? "persona" : "personas"}
                  </p>
                </div>
              </div>

              <button
                onClick={fetchInvites}
                className="mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm transition flex items-center gap-2 mx-auto"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Actualizar
              </button>
            </div>
          )}
        </div>

        {/* List of Invites */}
        {!loading && !error && invites.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 bg-mint-800 border-b border-mint-700">
              <h2 className="font-serif text-xl text-white">
                Lista de Confirmaciones
              </h2>
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-mint-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Invitaciones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invites.map((invite) => (
                    <tr
                      key={invite.id}
                      className="hover:bg-mint-50/30 transition"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {invite.guest_name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {invite.contact_info}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-800">
                          {invite.invite_count}{" "}
                          {invite.invite_count === 1
                            ? "invitación"
                            : "invitaciones"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(invite.accepted_at)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="p-6 hover:bg-mint-50/30 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {invite.guest_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {invite.contact_info}
                      </p>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gold-100 text-gold-800 ml-3 flex-shrink-0">
                      {invite.invite_count}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(invite.accepted_at)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && invites.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="font-serif text-xl text-gray-900 mb-2">
              Sin confirmaciones aún
            </h3>
            <p className="text-gray-600">
              Las confirmaciones aparecerán aquí cuando los invitados acepten
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
