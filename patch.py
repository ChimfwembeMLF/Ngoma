import sys

file_path = 'client/src/pages/PlaylistDetailPage.tsx'
with open(file_path, 'r') as f:
    content = f.read()

# 1. Imports
content = content.replace(
    "import { AppShell } from '@/components/layout/AppShell';",
    "import { AppShell } from '@/components/layout/AppShell';\nimport { EditPlaylistDialog } from '@/components/playlists/EditPlaylistDialog';"
)

# 2. State
content = content.replace(
    "  const [copyFeedback, setCopyFeedback] = useState('');",
    "  const [copyFeedback, setCopyFeedback] = useState('');\n  const [isEditing, setIsEditing] = useState(false);"
)

# 3. Render
header_start_index = content.find('<header className="mb-8 mt-4">')
if header_start_index != -1:
    content = content[:header_start_index] + "{isEditing ? (\n        <EditPlaylistDialog playlist={playlist} onClose={() => setIsEditing(false)} />\n      ) : (\n      " + content[header_start_index:]
    
    header_end_index = content.find('</header>', header_start_index) + len('</header>')
    content = content[:header_end_index] + "\n      )}" + content[header_end_index:]
    
    content = content.replace(
        "Make {playlist.isPublic ? 'private' : 'public'}\n                </Button>",
        "Make {playlist.isPublic ? 'private' : 'public'}\n                </Button>\n                <Button variant=\"outline\" onClick={() => setIsEditing(true)}>Edit</Button>"
    )

with open(file_path, 'w') as f:
    f.write(content)
