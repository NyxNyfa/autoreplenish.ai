import { useState, type FC, type FormEvent } from "react";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DemoModal: FC<DemoModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    storeCount: "50 - 200 toko",
    erpSystem: "SAP S/4HANA",
    email: "",
    phone: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleClose = () => {
    setSubmitted(false);
    onClose();
  };

  const inputCls =
    "w-full pl-3 pr-3 py-2.5 bg-[var(--bg)] border border-[var(--border)] rounded-[var(--radius-md)] text-[14px] text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)]";
  const labelCls = "text-[12px] text-[var(--text-muted)] block mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(22,22,21,0.8)]">
      <div className="relative w-full max-w-lg bg-[var(--surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 px-2 py-1 rounded-[var(--radius-sm)] text-[var(--text-muted)] hover:text-[var(--text)] border border-[var(--border)] cursor-pointer text-[14px]"
        >
          tutup
        </button>

        {submitted ? (
          <div className="py-8 space-y-4">
            <p className="text-[12px] text-[var(--text-faint)]">[ok] terkirim</p>
            <h3 className="text-[16px] font-bold text-[var(--text)]">
              permintaan demo masuk.
            </h3>
            <p className="text-[14px] text-[var(--text-muted)] leading-[1.7]">
              terima kasih, {formData.name || "bapak/ibu"}. tim kami hubungi via
              whatsapp / email dalam 1x24 jam.
            </p>
            <div className="p-3 bg-[var(--bg)] rounded-[var(--radius-md)] border border-[var(--border)] text-[12px] text-[var(--text-muted)]">
              sandbox siap untuk: {formData.company || "jaringan ritel anda"}
            </div>
            <button
              onClick={handleClose}
              className="mt-2 px-4 py-2.5 bg-[var(--btn-light-bg)] text-[var(--btn-light-text)] font-medium text-[14px] rounded-[var(--radius-md)] cursor-pointer"
            >
              kembali
            </button>
          </div>
        ) : (
          <div>
            <p className="text-[12px] text-[var(--text-faint)] mb-2">demo · pilot poc</p>
            <h3 className="text-[16px] font-bold text-[var(--text)]">
              jadwalkan live demo
            </h3>
            <p className="text-[14px] text-[var(--text-muted)] mt-1 mb-6">
              ceritakan kebutuhan SAP dan cabang pilot. kami siapkan simulasinya.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelCls}>nama lengkap</label>
                <input
                  required
                  type="text"
                  placeholder="nama anda"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>jaringan ritel</label>
                  <input
                    required
                    type="text"
                    placeholder="nama minimarket"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>jumlah gerai</label>
                  <select
                    value={formData.storeCount}
                    onChange={(e) =>
                      setFormData({ ...formData, storeCount: e.target.value })
                    }
                    className={inputCls}
                  >
                    <option>10 - 50 toko (pilot)</option>
                    <option>50 - 200 toko</option>
                    <option>200 - 1000 toko</option>
                    <option>&gt; 1000 toko</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>erp / system of record</label>
                <select
                  value={formData.erpSystem}
                  onChange={(e) =>
                    setFormData({ ...formData, erpSystem: e.target.value })
                  }
                  className={inputCls}
                >
                  <option>SAP S/4HANA (OData API)</option>
                  <option>SAP ECC 6.0</option>
                  <option>Oracle Retail / NetSuite</option>
                  <option>Custom POS + ERP</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>email kantor</label>
                  <input
                    required
                    type="email"
                    placeholder="nama@perusahaan.co.id"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>whatsapp</label>
                  <input
                    required
                    type="tel"
                    placeholder="0812-xxxx-xxxx"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={inputCls}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-[var(--btn-light-bg)] text-[var(--btn-light-text)] font-medium text-[14px] rounded-[var(--radius-md)] cursor-pointer"
              >
                kirim permintaan demo
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
