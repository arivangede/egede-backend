const { ResponseError } = require("../../../utilities/response")
const { prisma } = require("../../../utilities/database")

const layananPublik = async (req, res, next) => {
    try {
        const data = await prisma.layananPublik.findMany()

        res.status(200).json({ message: "Successfully.", data: data })
    } catch {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const layananPublikById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const data = await prisma.layananPublik.findFirst({
            where: { id }
        })

        if (!data) {
            return res.status(404).json({ message: "Data not found." })
        }

        res.status(200).json({ message: "Successfully", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const layananPublikDetails = async (req, res, next) => {
    try {
        const data = await prisma.layananPublik.findMany({
            include: {
                kategori_layanan_publik: true,
                penduduk: true,
                gate: true,
                daerah: true,
            }
        })

        const detailedData = await Promise.all(data.map(async (layanan) => {
            const penggunaPribadi = await prisma.penggunaPribadi.findFirst({
                where: { fk_penduduk_id: layanan.fk_penduduk_id },
                select: {
                    id: true
                }
            })

            let penggunaUmum = null

            if (penggunaPribadi) {
                penggunaUmum = await prisma.penggunaUmum.findFirst({
                    where: { id: penggunaPribadi.id },
                    select: {
                        email: true,
                        no_hp: true
                    }
                })
            }

            return {
                ...layanan,
                kontak: penggunaUmum ? {
                    email: penggunaUmum.email,
                    no_hp: penggunaUmum.no_hp
                } : null
            }
        }))

        res.status(200).json({ message: "Successfully.", data: detailedData })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const layananPublikDetailById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const layanan = await prisma.layananPublik.findFirst({
            where: { id },
            include: {
                kategori_layanan_publik: true,
                penduduk: true,
                gate: true,
                daerah: true,
            }
        })

        if (!layanan) {
            return res.status(404).json({ message: "Data not found." })
        }

        const penggunaPribadi = await prisma.penggunaPribadi.findFirst({
            where: { fk_penduduk_id: layanan.fk_penduduk_id },
            select: {
                id: true
            }
        })

        let penggunaUmum = null

        if (penggunaPribadi) {
            penggunaUmum = await prisma.penggunaUmum.findFirst({
                where: { id: penggunaPribadi.id },
                select: {
                    email: true,
                    no_hp: true
                }
            })
        }

        const detailedData = {
            ...layanan,
            kontak: penggunaUmum ? {
                email: penggunaUmum.email,
                no_hp: penggunaUmum.no_hp
            } : null
        }

        res.status(200).json({ message: "Successfully.", data: detailedData })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const layananPublikDetailsByUser = async (req, res, next) => {
    try {
        const userId = req.user.rnd

        const data = await prisma.layananPublik.findMany({
            where: {
                diajukan_oleh_id: userId
            },
            include: {
                kategori_layanan_publik: true,
                penduduk: true,
                gate: true,
                daerah: true,
            }
        })

        const detailedData = await Promise.all(data.map(async (layanan) => {
            const penggunaPribadi = await prisma.penggunaPribadi.findFirst({
                where: { fk_penduduk_id: layanan.fk_penduduk_id },
                select: {
                    id: true
                }
            })

            let penggunaUmum = null

            if (penggunaPribadi) {
                penggunaUmum = await prisma.penggunaUmum.findFirst({
                    where: { id: penggunaPribadi.id },
                    select: {
                        email: true,
                        no_hp: true
                    }
                })
            }

            return {
                ...layanan,
                kontak: penggunaUmum ? {
                    email: penggunaUmum.email,
                    no_hp: penggunaUmum.no_hp
                } : null
            }
        }))

        res.status(200).json({ message: "Successfully.", data: detailedData })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const layananPublikDetailsByGate = async (req, res, next) => {
    try {
        const gateId = req.user.gid

        const data = await prisma.layananPublik.findMany({
            where: {
                fk_gate_id: gateId
            },
            include: {
                kategori_layanan_publik: true,
                penduduk: true,
                daerah: true
            }
        })

        const detailedData = await Promise.all(data.map(async (layanan) => {
            const penggunaPribadi = await prisma.penggunaPribadi.findFirst({
                where: { fk_penduduk_id: layanan.fk_penduduk_id },
                select: {
                    id: true
                }
            })

            let penggunaUmum = null

            if (penggunaPribadi) {
                penggunaUmum = await prisma.penggunaUmum.findFirst({
                    where: { id: penggunaPribadi.id },
                    select: {
                        email: true,
                        no_hp: true
                    }
                })
            }

            return {
                ...layanan,
                kontak: penggunaUmum ? {
                    email: penggunaUmum.email,
                    no_hp: penggunaUmum.no_hp
                } : null
            }
        }))

        res.status(200).json({ message: "Successfully.", data: detailedData })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const filter = async (req, res, next) => {
    try {
        const {
            status,
            search,
            tanggal,
            kategori,
            jenisLayananPublik,
            offset = 0,
            limit = 10
        } = req.query
        const filters = {}

        if (status && ["Menunggu", "Ditolak", "Dikerjakan", "Selesai"].includes(status)) {
            filters.status_riwayat_terbaru = status;
        }

        if (search) {
            const penduduk = await prisma.penduduk.findMany({
                where: {
                    nama_lengkap: {
                        contains: search,
                        mode: "insensitive",
                    },
                },
                select: { id: true },
            })
            const pendudukIds = penduduk.map(p => p.id)
            filters.fk_penduduk_id = { in: pendudukIds }
        }

        if (tanggal) {
            const parsedDate = new Date(tanggal)
            if (!isNaN(parsedDate)) {
                filters.cts = {
                    gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
                    lt: new Date(parsedDate.setHours(24, 0, 0, 0)),
                }
            } else {
                return res.status(400).json({ message: "Invalid date format. Use yyyy-mm-dd." })
            }
        }

        if (kategori) {
            const kategoriLayanan = await prisma.kategoriLayananPublik.findFirst({
                where: { id: parseInt(kategori) },
                select: { id: true },
            })

            if (kategoriLayanan) {
                filters.fk_kategori_layanan_publik_id = kategoriLayanan.id
            } else {
                return res.status(404).json({ message: "Kategori layanan publik not found." })
            }
        }

        if (jenisLayananPublik) {
            const jenisLayanan = await prisma.jenisLayananPublik.findFirst({
                where: {
                    jenis: jenisLayananPublik,
                },
                select: { id: true },
            })

            if (jenisLayanan) {
                const kategoriIds = await prisma.kategoriLayananPublik.findMany({
                    where: {
                        fk_jenis_layanan_id: jenisLayanan.id,
                    },
                    select: { id: true },
                })

                filters.fk_kategori_layanan_publik_id = { in: kategoriIds.map(k => k.id) }
            } else {
                return res.status(400).json({ message: "Invalid jenis layanan publik." })
            }
        }

        const [data, total] = await prisma.$transaction([
            prisma.layananPublik.findMany({
                where: filters,
                include: {
                    kategori_layanan_publik: true,
                    penduduk: true,
                    gate: true,
                    daerah: true,
                },
                skip: parseInt(offset),
                take: parseInt(limit),
            }),
            prisma.layananPublik.count({
                where: filters,
            }),
        ]);

        res.status(200).json({ message: "Successfully.", count: total, data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const countLayananPublikByStatus = async (req, res, next) => {
    try {
        const statuses = ["Menunggu", "Ditolak", "Dikerjakan", "Selesai"]
        const counts = {}

        for (const status of statuses) {
            const count = await prisma.layananPublik.count({
                where: {
                    status_riwayat_terbaru: status
                }
            })
            counts[status] = count
        }

        res.status(200).json({ message: "Successfully.", data: counts })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const tambahLayananPublik = async (req, res, next) => {
    try {
        const data = req.body
        const tanggalSurat = new Date(data.tanggal_surat)
        const userId = req.user.rnd
        const gateId = req.user.gid
        const initialStatus = {
            status: "Menunggu",
            waktu: new Date().toISOString(),
        }

        const pengguna = await prisma.penggunaPribadi.findFirst({
            where: { id: userId },
            select: { fk_penduduk_id: true },
        })

        if (!pengguna) {
            return res.status(404).json({ message: "Pengguna is not found." })
        }

        const daerah = await prisma.daerah.findFirst({
            where: { fk_gate_id: gateId },
            select: { id: true },
        })

        if (!daerah) {
            return res.status(404).json({ message: "Daerah is not found." })
        }

        const fk_penduduk_id = pengguna.fk_penduduk_id
        const fk_daerah_id = daerah.id

        if (isNaN(tanggalSurat)) {
            throw new Error("Tanggal surat tidak valid.");
        }

        const kategoriLayanan = await prisma.kategoriLayananPublik.findUnique({
            where: { id: parseInt(data.fk_kategori_layanan_publik_id) },
        })

        if (!kategoriLayanan) {
            return res.status(404).json({ message: "Kategori layanan publik is not found." });
        }

        const newLayananPublik = await prisma.layananPublik.create({
            data: {
                fk_kategori_layanan_publik_id: parseInt(data.fk_kategori_layanan_publik_id),
                diajukan_oleh_id: userId,
                fk_penduduk_id: fk_penduduk_id,
                fk_gate_id: gateId,
                fk_daerah_id: fk_daerah_id,
                tanggal_surat: tanggalSurat,
                deskripsi: data.deskripsi,
                status_riwayat: [initialStatus],
                status_riwayat_terbaru: initialStatus.status,
            },
        })

        if (req.files && req.files.foto_ktp) {
            const fotoKtp = {
                filename: req.files.foto_ktp[0].filename,
                path: req.files.foto_ktp[0].path.replace(/\\/g, '/'),
            }

            await prisma.layananPublik.update({
                where: { id: newLayananPublik.id },
                data: { foto_ktp: fotoKtp },
            })
        }

        if (req.files && req.files.foto_kk) {
            const fotoKk = {
                filename: req.files.foto_kk[0].filename,
                path: req.files.foto_kk[0].path.replace(/\\/g, '/'),
            }

            await prisma.layananPublik.update({
                where: { id: newLayananPublik.id },
                data: { foto_kk: fotoKk },
            })
        }

        if (req.files && req.files.foto_akta_nikah) {
            const fotoAktaNikah = {
                filename: req.files.foto_akta_nikah[0].filename,
                path: req.files.foto_akta_nikah[0].path.replace(/\\/g, '/'),
            }

            await prisma.layananPublik.update({
                where: { id: newLayananPublik.id },
                data: { foto_akta_nikah: fotoAktaNikah },
            })
        }

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const statutDitolakLayananPublik = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const { catatan } = req.body
        const diterimaOleh = req.user.rnd

        const data = await prisma.layananPublik.findFirst({
            where: { id }
        })

        if (!data) {
            return res.status(404).json({ message: "Data is not found." })
        }

        const statusDitolak = {
            status: "Ditolak",
            waktu: new Date().toISOString(),
            catatan: catatan || null
        }

        await prisma.layananPublik.update({
            where: { id },
            data: {
                diterima_oleh_id: diterimaOleh,
                status_riwayat: {
                    push: statusDitolak
                },
                status_riwayat_terbaru: statusDitolak.status
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const statusDikerjakanLayananPublik = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const dikerjakanOleh = req.user.rnd

        const data = await prisma.layananPublik.findFirst({
            where: { id }
        })

        if (!data) {
            return res.status(404).json({ message: "Data is not found." })
        }

        const statusDikerjakan = {
            status: "Dikerjakan",
            waktu: new Date().toISOString(),
        }

        await prisma.layananPublik.update({
            where: { id },
            data: {
                diterima_oleh_id: dikerjakanOleh,
                status_riwayat: {
                    push: statusDikerjakan
                },
                status_riwayat_terbaru: statusDikerjakan.status
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const statusSelesaiLayananPublik = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const data = await prisma.layananPublik.findFirst({
            where: { id }
        })

        if (!data) {
            return res.status(404).json({ message: "Data is not found." })
        }

        const statusSelesai = {
            status: "Selesai",
            waktu: new Date().toISOString(),
        }

        await prisma.layananPublik.update({
            where: { id },
            data: {
                status_riwayat: {
                    push: statusSelesai
                },
                status_riwayat_terbaru: statusSelesai.status
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

module.exports = {
    layananPublik,
    layananPublikById,
    layananPublikDetails,
    layananPublikDetailById,
    layananPublikDetailsByUser,
    layananPublikDetailsByGate,
    filter,
    countLayananPublikByStatus,
    tambahLayananPublik,
    statutDitolakLayananPublik,
    statusDikerjakanLayananPublik,
    statusSelesaiLayananPublik
}