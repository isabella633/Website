import { RequestHandler } from "express";

interface ScriptData {
  id: string;
  code: string;
  createdAt: string;
  owner: string;
}

// In-memory storage for demo (in production, use a database)
export const scripts: Map<string, ScriptData> = new Map();

// Add some sample data for demonstration
scripts.set("demo1", {
  id: "demo1",
  code: `-- Lua Hello World Example
print("Hello, World!")
print("This is a demo Lua script")

function greet(name)
    return "Hello, " .. name .. "!"
end

print(greet("defendlua"))`,
  createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  owner: "demo-user"
});

scripts.set("demo2", {
  id: "demo2",
  code: `-- Advanced Lua Script
local players = {}

function addPlayer(name, score)
    table.insert(players, {name = name, score = score})
    print("Added player: " .. name .. " with score: " .. score)
end

function getTopPlayer()
    local top = players[1]
    for i = 2, #players do
        if players[i].score > top.score then
            top = players[i]
        end
    end
    return top
end

-- Initialize some players
addPlayer("Alice", 150)
addPlayer("Bob", 200)
addPlayer("Charlie", 175)

local winner = getTopPlayer()
print("Top player: " .. winner.name .. " with score: " .. winner.score)`,
  createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
  owner: "demo-user"
});

scripts.set("demo3", {
  id: "demo3",
  code: `-- Simple Calculator
function add(a, b) return a + b end
function subtract(a, b) return a - b end
function multiply(a, b) return a * b end
function divide(a, b) return b ~= 0 and a / b or "Cannot divide by zero" end

print("Calculator Demo:")
print("5 + 3 =", add(5, 3))
print("10 - 4 =", subtract(10, 4))
print("7 * 6 =", multiply(7, 6))
print("15 / 3 =", divide(15, 3))`,
  createdAt: new Date().toISOString(), // Now
  owner: "demo-user"
});

export const handleProtectScript: RequestHandler = (req, res) => {
  try {
    const { code, owner } = req.body;

    console.log('Protect script request:', {
      codeLength: code?.length || 0,
      owner: owner || 'undefined',
      hasCode: !!code,
      hasOwner: !!owner
    });

    if (!code || !owner) {
      console.log('Missing required fields:', { code: !!code, owner: !!owner });
      return res.status(400).json({ error: "Code and owner are required" });
    }

    // Generate script ID
    const scriptId = Math.random().toString(36).substr(2, 12);

    const scriptData: ScriptData = {
      id: scriptId,
      code,
      createdAt: new Date().toISOString(),
      owner,
    };

    // Store the script
    scripts.set(scriptId, scriptData);

    console.log('Script protected successfully:', { scriptId, codeLength: code.length });
    res.json({ scriptId, message: "Script protected successfully" });
  } catch (error) {
    console.error('Error protecting script:', error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getScript = (scriptId: string): ScriptData | undefined => {
  return scripts.get(scriptId);
};

export const updateScript = (
  scriptId: string,
  updatedData: ScriptData,
): void => {
  scripts.set(scriptId, updatedData);
};
