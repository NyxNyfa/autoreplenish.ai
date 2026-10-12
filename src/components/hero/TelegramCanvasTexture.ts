import { CanvasTexture, SRGBColorSpace } from "three";
import { CINEMATIC_CONFIG } from "@/config/cinematic.config";

export class TelegramCanvasTextureManager {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public texture: CanvasTexture;

  private lastRenderKey: string = "";

  constructor() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = 1024;
    this.canvas.height = 2048;

    const ctx = this.canvas.getContext("2d", { alpha: false });
    if (!ctx) {
      throw new Error("Failed to get 2D context for TelegramCanvasTexture");
    }
    this.ctx = ctx;

    this.texture = new CanvasTexture(this.canvas);
    this.texture.anisotropy = 8;
    this.texture.colorSpace = SRGBColorSpace;

    this.render(0, 0);
  }

  public update(phaseIndex: number, phaseProgress: number) {
    const step =
      phaseIndex === 1
        ? Math.floor(phaseProgress * 20)
        : phaseIndex === 2
        ? Math.floor(phaseProgress * 12)
        : phaseIndex === 5
        ? Math.floor(phaseProgress * 12)
        : Math.floor(phaseProgress * 6);

    const key = `${phaseIndex}_${step}`;

    if (key !== this.lastRenderKey) {
      this.lastRenderKey = key;
      this.render(phaseIndex, phaseProgress);
      this.texture.needsUpdate = true;
    }
  }

  private render(phaseIndex: number, phaseProgress: number) {
    const ctx = this.ctx;
    const W = this.canvas.width;
    const H = this.canvas.height;

    // Strict Native Telegram Dark Palette (NO design.md clay orange allowed)
    const P = {
      chatBg: "#0e1621",
      header: "#17212b",
      cardBg: "#182533",
      accentBlue: "#2aabee",
      hoverBlue: "#229bd8",
      successGreen: "#00c278",
      text: "#ffffff",
      textMuted: "#8b98a5",
      warningRed: "#ff7675",
      divider: "rgba(255, 255, 255, 0.08)",
      innerBoxBg: "#141e28",
    };

    // Strict safe edge margins (>= 64px from all edges)
    const padLeft = 68;
    const padRight = 72;
    const padY = 56;
    const contentW = W - padLeft - padRight; // ~884px

    // 1. Chat Background (#0e1621)
    ctx.fillStyle = P.chatBg;
    ctx.fillRect(0, 0, W, H);

    // 2. Status Bar Top
    ctx.fillStyle = P.textMuted;
    ctx.font = "bold 28px 'IBM Plex Mono', monospace";
    ctx.textAlign = "left";
    ctx.fillText("07:15", padLeft, padY + 28);

    ctx.textAlign = "right";
    ctx.fillText("5G  [■■■]", W - padRight, padY + 28);

    // 3. Telegram Header (#17212b)
    const headerY = padY + 54;
    const headerH = 148;
    ctx.fillStyle = P.header;
    ctx.fillRect(0, headerY, W, headerH);

    // Header divider line
    ctx.strokeStyle = P.divider;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, headerY + headerH);
    ctx.lineTo(W, headerY + headerH);
    ctx.stroke();

    // Bot Avatar
    const avatarX = padLeft + 48;
    const avatarY = headerY + 74;
    ctx.fillStyle = "#223244";
    ctx.beginPath();
    ctx.arc(avatarX, avatarY, 44, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = P.accentBlue;
    ctx.font = "bold 32px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("AR", avatarX, avatarY);

    // Bot Name + Verified Blue Badge
    ctx.textAlign = "left";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = P.text;
    ctx.font = "bold 34px 'IBM Plex Mono', monospace";
    ctx.fillText("AutoReplenish Bot", avatarX + 64, headerY + 66);

    // Blue verified check circle
    ctx.fillStyle = P.accentBlue;
    ctx.beginPath();
    ctx.arc(avatarX + 440, headerY + 54, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("✓", avatarX + 440, headerY + 60);

    // Subtitle "bot · online" with green dot
    ctx.textAlign = "left";
    ctx.fillStyle = P.successGreen;
    ctx.beginPath();
    ctx.arc(avatarX + 66, headerY + 104, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = P.textMuted;
    ctx.font = "24px 'IBM Plex Mono', monospace";
    ctx.fillText("bot · online", avatarX + 86, headerY + 112);

    // 4. Centered Date-Chip Pill (#17212b, text #8b98a5)
    const dateY = headerY + headerH + 32;
    const dateChipW = 340;
    const dateChipH = 50;
    ctx.fillStyle = P.header;
    this.roundRect(ctx, W / 2 - dateChipW / 2, dateY, dateChipW, dateChipH, 16);
    ctx.fill();
    ctx.strokeStyle = P.divider;
    ctx.stroke();

    ctx.fillStyle = P.textMuted;
    ctx.font = "24px 'IBM Plex Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("Hari ini, 07:15 WIB", W / 2, dateY + 34);

    // L0 IDLE: Render standby active telemetry card
    if (phaseIndex === 0) {
      const sbY = dateY + dateChipH + 28;
      ctx.fillStyle = P.cardBg;
      this.roundRect(ctx, padLeft, sbY, contentW, 320, 22);
      ctx.fill();
      ctx.strokeStyle = P.divider;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.fillStyle = P.accentBlue;
      ctx.font = "bold 28px 'IBM Plex Mono', monospace";
      ctx.fillText("⚡ Real-time Telemetry Standby", padLeft + 36, sbY + 64);

      ctx.fillStyle = P.text;
      ctx.font = "24px 'IBM Plex Mono', monospace";
      ctx.fillText("Monitoring 3 Cabang Minimarket...", padLeft + 36, sbY + 120);

      ctx.fillStyle = P.textMuted;
      ctx.font = "22px 'IBM Plex Mono', monospace";
      ctx.fillText("Status: Sensor inventori aktif", padLeft + 36, sbY + 172);
      ctx.fillText("AI reasoning: Siap mendeteksi stockout", padLeft + 36, sbY + 220);

      ctx.fillStyle = P.accentBlue;
      ctx.fillText("Gulir untuk melihat alur kerja ↓", padLeft + 36, sbY + 270);
      return;
    }

    // L5 RESET FADE: Return to clean standby
    if (phaseIndex === 5 && phaseProgress >= 0.7) return;

    // 5. Telegram Message Bubble (#182533)
    const targetBubbleY = dateY + dateChipH + 28;
    let bubbleY = targetBubbleY;

    if (phaseIndex === 1) {
      const slideProgress = Math.min(1.0, phaseProgress * 4.0);
      const easeOut = 1 - Math.pow(1 - slideProgress, 3);
      bubbleY = targetBubbleY + (1 - easeOut) * 350;
    }

    const bubbleX = padLeft;
    const bubbleW = contentW;
    const bubbleH = 1580;

    ctx.fillStyle = P.cardBg;
    this.roundRect(ctx, bubbleX, bubbleY, bubbleW, bubbleH, 22);
    ctx.fill();
    ctx.strokeStyle = P.divider;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Bubble Title
    ctx.textAlign = "left";
    ctx.fillStyle = P.text;
    ctx.font = "bold 30px 'IBM Plex Mono', monospace";
    ctx.fillText("📦 AUTOREPLENISH.AI — Rekomendasi", bubbleX + 36, bubbleY + 58);

    ctx.strokeStyle = P.divider;
    ctx.beginPath();
    ctx.moveTo(bubbleX + 36, bubbleY + 84);
    ctx.lineTo(bubbleX + bubbleW - 36, bubbleY + 84);
    ctx.stroke();

    // 6. S1 Typing: Telemetry Status Stream
    // "Cabang Sudirman · Roti Manis Cokelat 100g · Stok 12 / Threshold 20 · Lead Time 2 Hari · Cuaca: Hujan deras 🌧️"
    let curY = bubbleY + 128;
    const telemetryText =
      "Cabang Sudirman · Roti Manis Cokelat 100g · Stok 12 / Threshold 20 · Lead Time 2 Hari · Cuaca: Hujan deras 🌧️";

    ctx.fillStyle = P.textMuted;
    ctx.font = "24px 'IBM Plex Mono', monospace";
    const telemLines = this.wrapText(ctx, telemetryText, bubbleW - 72);
    for (const line of telemLines) {
      ctx.fillText(line, bubbleX + 36, curY);
      curY += 36;
    }

    // 7. Reasoning Narrative Box (AWS Bedrock)
    curY += 16;
    const narrBoxH = 340;
    ctx.fillStyle = P.innerBoxBg;
    this.roundRect(ctx, bubbleX + 36, curY, bubbleW - 72, narrBoxH, 16);
    ctx.fill();
    ctx.strokeStyle = P.divider;
    ctx.stroke();

    // Left blue accent bar
    ctx.fillStyle = P.accentBlue;
    ctx.fillRect(bubbleX + 36, curY, 6, narrBoxH);

    ctx.fillStyle = P.accentBlue;
    ctx.font = "bold 26px 'IBM Plex Mono', monospace";
    ctx.fillText("🧠 Analisis Agent (AWS Bedrock):", bubbleX + 56, curY + 46);

    const fullNarrative = CINEMATIC_CONFIG.telegramCard.agentAnalysis;
    let narrativeToDraw: string = fullNarrative;
    if (phaseIndex === 1) {
      const typeProgress = Math.min(1.0, Math.max(0.0, (phaseProgress - 0.35) / 0.5));
      const charCount = Math.floor(fullNarrative.length * typeProgress);
      narrativeToDraw = fullNarrative.slice(0, charCount);
    }

    if (narrativeToDraw.length > 0) {
      ctx.fillStyle = P.text;
      this.renderWrappedText(
        ctx,
        `"${narrativeToDraw}"`,
        bubbleX + 56,
        curY + 96,
        bubbleW - 112,
        34,
        6
      );
    }

    // 8. Recommendation Box: Strict Word-Wrapping (No Bezel Overflow)
    // "Rekomendasi: 15 Pcs (1 Dus) — Normal: 50 Pcs"
    curY += narrBoxH + 28;
    const recBoxH = 148;
    const showRecommendation = phaseIndex > 1 || (phaseIndex === 1 && phaseProgress >= 0.78);

    if (showRecommendation) {
      ctx.fillStyle = "#1e2e42";
      this.roundRect(ctx, bubbleX + 36, curY, bubbleW - 72, recBoxH, 16);
      ctx.fill();
      ctx.strokeStyle = "rgba(42, 171, 238, 0.35)";
      ctx.stroke();

      ctx.fillStyle = P.accentBlue;
      ctx.font = "bold 28px 'IBM Plex Mono', monospace";
      const recMsg = "💡 Rekomendasi: 15 Pcs (1 Dus) — Normal: 50 Pcs";
      this.renderWrappedText(
        ctx,
        recMsg,
        bubbleX + 56,
        curY + 48,
        bubbleW - 112,
        36,
        2
      );

      ctx.fillStyle = P.textMuted;
      ctx.font = "24px 'IBM Plex Mono', monospace";
      ctx.fillText("Diskon Cuaca: -70% · Mitigasi Kadaluwarsa", bubbleX + 56, curY + 120);
    }

    // 9. Buttons State / Success State (L2+)
    curY += recBoxH + 36;
    const isApprovedOrLater = phaseIndex >= 2 && (phaseIndex > 2 || phaseProgress > 0.28);
    const isTappingApprove = phaseIndex === 2 && phaseProgress <= 0.28;

    if (!isApprovedOrLater) {
      // S2 Telegram Blue (#2aabee) Confirm/Approve Button
      const btnW = bubbleW - 72;
      const btnH = 96;

      if (isTappingApprove) {
        ctx.strokeStyle = P.accentBlue;
        ctx.lineWidth = 4;
        this.roundRect(ctx, bubbleX + 30, curY - 6, btnW + 12, btnH + 12, 20);
        ctx.stroke();

        ctx.fillStyle = P.hoverBlue;
        this.roundRect(ctx, bubbleX + 42, curY + 4, btnW - 12, btnH - 8, 14);
        ctx.fill();
      } else {
        ctx.fillStyle = P.accentBlue;
        this.roundRect(ctx, bubbleX + 36, curY, btnW, btnH, 16);
        ctx.fill();
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 30px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("✓ Approve & Kirim ke SAP", bubbleX + 36 + btnW / 2, curY + 60);

      // Secondary outlined buttons row
      const secY = curY + btnH + 20;
      const secW = (btnW - 20) / 2;
      const secH = 76;

      ctx.fillStyle = P.header;
      ctx.strokeStyle = P.divider;
      ctx.lineWidth = 2;

      this.roundRect(ctx, bubbleX + 36, secY, secW, secH, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = P.textMuted;
      ctx.font = "24px 'IBM Plex Mono', monospace";
      ctx.fillText("Ubah Jumlah", bubbleX + 36 + secW / 2, secY + 48);

      this.roundRect(ctx, bubbleX + 36 + secW + 20, secY, secW, secH, 12);
      ctx.fill();
      ctx.stroke();
      ctx.fillText("Tolak", bubbleX + 36 + secW + 20 + secW / 2, secY + 48);
    } else {
      // Success State Card (Telegram Dark Green)
      const successBoxH = 280;
      ctx.fillStyle = "#11261d";
      this.roundRect(ctx, bubbleX + 36, curY, bubbleW - 72, successBoxH, 16);
      ctx.fill();
      ctx.strokeStyle = P.successGreen;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.textAlign = "left";
      ctx.fillStyle = P.successGreen;
      ctx.font = "bold 30px 'IBM Plex Mono', monospace";
      ctx.fillText("✓ Disetujui Kepala Toko", bubbleX + 60, curY + 54);

      ctx.fillStyle = P.text;
      ctx.font = "bold 26px 'IBM Plex Mono', monospace";
      ctx.fillText("SAP PR ID : PR-4500012345", bubbleX + 60, curY + 104);
      ctx.fillText("SKU       : Roti Manis Cokelat (15 Pcs)", bubbleX + 60, curY + 152);
      ctx.fillText("Armada    : TRK-2148 [Dispatched]", bubbleX + 60, curY + 200);

      ctx.fillStyle = P.textMuted;
      ctx.font = "24px 'IBM Plex Mono', monospace";
      ctx.fillText("Status    : Sinkron SAP S/4HANA Berhasil", bubbleX + 60, curY + 246);

      // Toast pill at bottom
      const toastW = 440;
      const toastH = 48;
      const toastY = curY + successBoxH + 24;
      ctx.fillStyle = P.successGreen;
      this.roundRect(ctx, W / 2 - toastW / 2, toastY, toastW, toastH, 14);
      ctx.fill();

      ctx.fillStyle = "#0e1621";
      ctx.font = "bold 22px 'IBM Plex Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("✓ PR SAP Otomatis Dibuat", W / 2, toastY + 32);
    }

    // Delivery check ticks
    ctx.textAlign = "right";
    ctx.fillStyle = P.accentBlue;
    ctx.font = "24px 'IBM Plex Mono', monospace";
    ctx.fillText("07:15 ✓✓", bubbleX + bubbleW - 36, bubbleY + bubbleH - 36);
  }

  private wrapText(
    ctx: CanvasRenderingContext2D,
    text: string,
    maxWidth: number
  ): string[] {
    const words = text.split(" ");
    const lines: string[] = [];
    let currentLine = words[0] || "";

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  }

  private renderWrappedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    maxLines: number = 4
  ) {
    const lines = this.wrapText(ctx, text, maxWidth);
    ctx.textAlign = "left";

    for (let i = 0; i < Math.min(lines.length, maxLines); i++) {
      let lineText = lines[i];
      if (i === maxLines - 1 && lines.length > maxLines) {
        lineText += "...";
      }
      ctx.fillText(lineText, x, y + i * lineHeight);
    }
  }

  private roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  public dispose() {
    this.texture.dispose();
  }
}
