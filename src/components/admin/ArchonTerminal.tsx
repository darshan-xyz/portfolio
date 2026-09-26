import { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Sparkles, Send, ShieldAlert, Cpu } from "lucide-react";
import type { AdminDashboardData } from "@/lib/admin/types";
import {
  analyzeSessionEntropy,
  toggleIpQuarantine,
  getQuarantinedIps,
} from "@/lib/security/entropy-analyzer";
import { cyberAudio } from "@/lib/admin/cyber-audio";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArchonTerminalProps {
  data: AdminDashboardData;
}

interface OutputLine {
  id: string;
  type: "cmd" | "res" | "err" | "sys";
  text: string;
}

export function ArchonTerminal({ data }: ArchonTerminalProps) {
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const [output, setOutput] = useState<OutputLine[]>([
    {
      id: "init-1",
      type: "sys",
      text: "ARCHON COGNITION TERMINAL v3.2.0 [CLEARANCE: ROOT]",
    },
    {
      id: "init-2",
      type: "sys",
      text: "Type 'help' to review tactical command directives.",
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  const executeCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    cyberAudio.playTacticalClick(1400, 0.02);

    // Record to history
    setHistory((prev) => [cmd, ...prev]);
    setHistoryIdx(-1);

    const parts = cmd.split(" ");
    const mainCmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    const newLines: OutputLine[] = [{ id: `cmd-${Date.now()}`, type: "cmd", text: `> ${cmd}` }];

    switch (mainCmd) {
      case "help":
        newLines.push({
          id: `res-${Date.now()}-1`,
          type: "res",
          text: `AVAILABLE TACTICAL DIRECTIVES:
  • help                         - Display tactical command catalog
  • query visitors [--flag val]  - Query live visitors (--device mobile|desktop, --min-dwell <sec>)
  • scan threats                 - Execute multi-vector entropy security scan on all sessions
  • crm                          - Display recruiter CRM opportunity status
  • stats                        - Print executive telemetry summary
  • quarantine <ip>              - Toggle dynamic hardware firewall quarantine for IP
  • audio                        - Toggle cyber-acoustic audio HUD
  • clear                        - Purge terminal buffer`,
        });
        break;

      case "stats":
        newLines.push({
          id: `res-${Date.now()}-2`,
          type: "res",
          text: `EXECUTIVE TELEMETRY METRICS:
  Total Pageviews     : ${data.stats.totalViews}
  Unique Visitors     : ${data.stats.uniqueVisitors}
  Avg Active Dwell    : ${data.stats.avgDwellSeconds}s
  Resume Downloads    : ${data.stats.resumeDownloads}
  Target Corp Visits  : ${data.stats.targetCompanyVisits}`,
        });
        break;

      case "scan":
        if (args[0] === "threats" || args.length === 0) {
          const sessions = data.visitors || [];
          if (sessions.length === 0) {
            newLines.push({
              id: `res-${Date.now()}-3`,
              type: "res",
              text: "[ SCAN COMPLETE: 0 Active in-memory sessions ]",
            });
          } else {
            const results = sessions.map((s) => {
              const res = analyzeSessionEntropy(s);
              return `  [${res.threatLevel}] IP: ${s.ip.padEnd(15)} | Threat: ${String(res.compositeThreatScore).padStart(2)}/100 | ${res.heuristics.join("; ") || "Nominal"}`;
            });
            newLines.push({
              id: `res-${Date.now()}-4`,
              type: "res",
              text: `ARCHON SENTINEL FORENSIC AUDIT (${sessions.length} sessions evaluated):\n${results.join("\n")}`,
            });
          }
        } else {
          newLines.push({
            id: `err-${Date.now()}`,
            type: "err",
            text: `Unknown scan target '${args[0]}'. Use 'scan threats'.`,
          });
        }
        break;

      case "query":
        if (args[0] === "visitors" || args.length === 0) {
          let filtered = [...(data.visitors || [])];

          // Parse flags
          for (let i = 1; i < args.length; i++) {
            if (args[i] === "--device" && args[i + 1]) {
              const dev = args[i + 1].toLowerCase();
              filtered = filtered.filter((v) => v.deviceType === dev);
              i++;
            } else if (args[i] === "--min-dwell" && args[i + 1]) {
              const dwell = parseInt(args[i + 1], 10);
              filtered = filtered.filter((v) => v.activeDwellSeconds >= dwell);
              i++;
            }
          }

          if (filtered.length === 0) {
            newLines.push({
              id: `res-${Date.now()}-5`,
              type: "res",
              text: "No visitor sessions matched the query criteria.",
            });
          } else {
            const lines = filtered
              .slice(0, 10)
              .map(
                (v) =>
                  `  • ${v.ip.padEnd(15)} | ${v.countryCode.padEnd(3)} ${v.city.padEnd(15)} | ${v.deviceType.padEnd(8)} | Dwell: ${String(v.activeDwellSeconds).padStart(3)}s | Referrer: ${v.referrer || "Direct"}`,
              );
            newLines.push({
              id: `res-${Date.now()}-6`,
              type: "res",
              text: `MATCHED SESSIONS (${filtered.length}):\n${lines.join("\n")}`,
            });
          }
        } else {
          newLines.push({
            id: `err-${Date.now()}`,
            type: "err",
            text: `Unknown query entity '${args[0]}'. Use 'query visitors'.`,
          });
        }
        break;

      case "crm": {
        const inq = data.inquiries || [];
        if (inq.length === 0) {
          newLines.push({
            id: `res-${Date.now()}-7`,
            type: "res",
            text: "[ CRM PIPELINE: Zero inbound recruiter messages currently ]",
          });
        } else {
          const list = inq.map(
            (i) =>
              `  • [${i.pipelineStage.toUpperCase()}] ${i.name} (${i.company || "Independent"}) — ${i.email}`,
          );
          newLines.push({
            id: `res-${Date.now()}-8`,
            type: "res",
            text: `RECRUITER CRM INQUIRIES (${inq.length}):\n${list.join("\n")}`,
          });
        }
        break;
      }

      case "quarantine": {
        if (!args[0]) {
          const qList = getQuarantinedIps();
          newLines.push({
            id: `res-${Date.now()}-9`,
            type: "res",
            text: `CURRENTLY QUARANTINED IPS (${qList.length}):\n${qList.map((ip) => `  • ${ip}`).join("\n") || "  None"}`,
          });
        } else {
          const targetIp = args[0];
          const isNow = toggleIpQuarantine(targetIp);
          newLines.push({
            id: `res-${Date.now()}-10`,
            type: isNow ? "err" : "res",
            text: isNow
              ? `[ DEFCON ALERT ] IP ${targetIp} has been LOCKED in quarantine.`
              : `[ ACCESS GRANTED ] IP ${targetIp} released from quarantine.`,
          });
        }
        break;
      }

      case "audio": {
        const active = cyberAudio.toggleMute();
        newLines.push({
          id: `res-${Date.now()}-11`,
          type: "res",
          text: active
            ? "Cyber-Acoustic Sonification HUD: [ ONLINE ]"
            : "Cyber-Acoustic Sonification HUD: [ MUTED ]",
        });
        break;
      }

      case "clear":
        setOutput([]);
        setInputVal("");
        return;

      default:
        newLines.push({
          id: `err-${Date.now()}`,
          type: "err",
          text: `Command not recognized: '${mainCmd}'. Type 'help' for available directives.`,
        });
        break;
    }

    setOutput((prev) => [...prev, ...newLines]);
    setInputVal("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIdx = Math.min(history.length - 1, historyIdx + 1);
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal("");
      }
    }
  };

  return (
    <Card className="border-border bg-surface/70 backdrop-blur-xl font-mono">
      <CardHeader className="border-b border-border/80 pb-3 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <TerminalIcon className="h-4 w-4 text-accent" />
          <CardTitle className="text-xs font-semibold text-foreground tracking-wider">
            ARCHON MATRIX COGNITION // DIRECTIVE TERMINAL
          </CardTitle>
        </div>
        <Badge variant="outline" className="border-accent/30 bg-accent/10 text-accent text-[10px]">
          INTERPRETER READY
        </Badge>
      </CardHeader>
      <CardContent className="p-4">
        {/* Terminal Screen Container */}
        <div className="h-[440px] overflow-y-auto rounded-lg border border-border bg-[#040914] p-4 font-mono text-xs text-[#E6FFF3] shadow-inner">
          <div className="space-y-2 whitespace-pre-wrap">
            {output.map((line) => (
              <div
                key={line.id}
                className={
                  line.type === "cmd"
                    ? "text-[#7CF9C9] font-bold"
                    : line.type === "err"
                      ? "text-rose-400"
                      : line.type === "sys"
                        ? "text-[#B8FF3A]"
                        : "text-muted-foreground"
                }
              >
                {line.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        </div>

        {/* Command Input Bar */}
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-[#040914] px-3 py-1.5 focus-within:border-accent">
          <span className="text-accent font-bold">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type directive (e.g. 'help', 'query visitors --device mobile', 'scan threats')..."
            className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none"
            autoFocus
          />
          <button
            onClick={() => executeCommand(inputVal)}
            className="text-muted-foreground hover:text-accent transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
