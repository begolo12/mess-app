Add-Type -AssemblyName System.Drawing

function New-Icon {
    param([int]$Size, [string]$Path)
    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = 'AntiAlias'
    $g.TextRenderingHint = 'AntiAlias'
    $brush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(37, 99, 235))
    $g.FillRectangle($brush, 0, 0, $Size, $Size)
    $font = New-Object System.Drawing.Font('Segoe UI', [int]($Size * 0.55), [System.Drawing.FontStyle]::Bold)
    $textBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = 'Center'
    $sf.LineAlignment = 'Center'
    $rect = New-Object System.Drawing.RectangleF 0, 0, $Size, $Size
    $g.DrawString('M', $font, $textBrush, $rect, $sf)
    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
    Write-Host "Wrote $Path"
}

New-Icon -Size 192 -Path "$PSScriptRoot\..\public\icon-192.png"
New-Icon -Size 512 -Path "$PSScriptRoot\..\public\icon-512.png"
