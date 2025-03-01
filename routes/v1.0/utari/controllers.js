const { ResponseError } = require("../../../utilities/response")
const { prisma } = require("../../../utilities/database")
const fs = require("fs")

const utari = async (req, res, next) => {
    try {
        const data = await prisma.utari.findMany()

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const utariById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const data = await prisma.utari.findFirst({
            where: { id }
        })

        if (!data) {
            return res.status(404).json({ message: "Data is not found." })
        }

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const utariDetails = async (req, res, next) => {
    try {
        const utariDetails = await prisma.utari.findMany({
            include: {
                diajukan_oleh: {
                    include: {
                        penduduk: true
                    }
                },
                diterima_oleh: {
                    include: {
                        penduduk: true
                    }
                },
                kategoriUtari: true
            }
        });

        const formattedUtariDetails = utariDetails.map(utari => ({
            ...utari,
            nama_penduduk_diajukan: utari.diajukan_oleh?.penduduk?.nama_lengkap || null,
            nama_penduduk_diterima: utari.diterima_oleh?.penduduk?.nama_lengkap || null
        }));

        res.status(200).json({ message: "Successfully.", data: formattedUtariDetails });
    } catch (error) {
        console.error("ERROR =>", error);
        next(new ResponseError(500, "Internal server error"));
    }
}

const utariDetailById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const utari = await prisma.utari.findFirst({
            where: { id },
            include: {
                diajukan_oleh: {
                    include: {
                        penduduk: true
                    }
                },
                diterima_oleh: {
                    include: {
                        penduduk: true
                    }
                },
                kategoriUtari: true
            }
        })

        if (!utari) {
            return res.status(404).json({ message: "Data is not found." })
        }

        const utariDetail = {
            ...utari,
            nama_penduduk_diajukan: utari.diajukan_oleh?.penduduk?.nama_lengkap || null,
            nama_penduduk_diterima: utari.diterima_oleh?.penduduk?.nama_lengkap || null
        }

        res.status(200).json({ message: "Successfully.", data: utariDetail })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const utariDetailByUser = async (req, res, next) => {
    try {
        const userId = req.user.rnd

        const utariDetails = await prisma.utari.findMany({
            where: {
                diajukan_oleh_id: userId
            },
            include: {
                diterima_oleh: {
                    include: {
                        penduduk: true
                    }
                },
                kategoriUtari: true
            }
        })

        res.status(200).json({ message: "Successfully.", data: utariDetails })
    } catch (error) {
        console.error("ERROR =>", error);
        next(new ResponseError(500, "Internal server error"))
    }
}

const utariFilter = async (req, res, next) => {
    try {
        const { fk_kategori_utari_id, status_riwayat_terbaru, nama_lengkap, offset, limit } = req.query

        const filterOptions = {
            where: {},
            orderBy: {
                cts: 'desc'
            },
            skip: parseInt(offset) || 0,
            take: parseInt(limit) || 10,
            include: {
                diajukan_oleh: {
                    include: {
                        penduduk: true
                    }
                }
            }
        }

        if (fk_kategori_utari_id) {
            filterOptions.where.fk_kategori_utari_id = parseInt(fk_kategori_utari_id)
        }

        if (status_riwayat_terbaru) {
            filterOptions.where.status_riwayat_terbaru = status_riwayat_terbaru
        }

        if (nama_lengkap) {
            filterOptions.where.diajukan_oleh = {
                penduduk: {
                    nama_lengkap: {
                        contains: nama_lengkap,
                        mode: 'insensitive'
                    }
                }
            }
        }

        const data = await prisma.utari.findMany(filterOptions)

        res.status(200).json({ message: "Successfully.", data: data })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const utariDataPenduduk = async (req, res, next) => {
    try {
        const data = req.body
        const diajukanOleh = req.user.rnd
        const { filename, path } = req.file
        const initialStatus = {
            status: "Menunggu",
            waktu: new Date().toISOString()
        }

        const fileData = {
            filename: filename,
            path: path.replace(/\\/g, '/')
        }

        const tanggalLahir = new Date(data.tanggal_lahir)
        if (isNaN(tanggalLahir)) {
            throw new Error("Tanggal lahir tidak valid")
        }


        await prisma.utari.create({
            data: {
                fk_kategori_utari_id: parseInt(data.fk_kategori_utari_id),
                diajukan_oleh_id: diajukanOleh,
                nik: data.nik,
                nama_lengkap: data.nama_lengkap,
                tempat_lahir: data.tempat_lahir,
                tanggal_lahir: tanggalLahir,
                jenis_kelamin: data.jenis_kelamin,
                alamat: data.alamat,
                agama: data.agama,
                status_nikah: data.status_nikah,
                pekerjaan: data.pekerjaan,
                suku_bangsa: data.suku_bangsa,
                kewarganegaraan: data.kewarganegaraan,
                golongan_darah: data.golongan_darah,
                foto_ktp: fileData,
                status_riwayat: [initialStatus],
                status_riwayat_terbaru: initialStatus.status
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const updateUtariDataPenduduk = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const utari = await prisma.utari.findFirst({
            where: { id }
        })

        if (!utari) {
            return res.status(404).json({ message: "Data is not found." })
        }

        const updated = {}
        if (req.file) {
            if (utari.foto_ktp) {
                fs.unlinkSync(utari.foto_ktp.path)
            }

            const { filename, path } = req.file
            const filepath = path.replace(/\\/g, "/")
            updated.foto_ktp = { filename: filename, path: filepath }
        }

        updated.fk_kategori_utari_id = parseInt(req.body.fk_kategori_utari_id)
        updated.nik = req.body.nik
        updated.nama_lengkap = req.body.nama_lengkap
        updated.tempat_lahir = req.body.tempat_lahir
        updated.tanggal_lahir = new Date(req.body.tanggal_lahir)
        updated.jenis_kelamin = req.body.jenis_kelamin
        updated.alamat = req.body.alamat
        updated.agama = req.body.agama
        updated.status_nikah = req.body.status_nikah
        updated.pekerjaan = req.body.pekerjaan
        updated.suku_bangsa = req.body.suku_bangsa
        updated.kewarganegaraan = req.body.kewarganegaraan
        updated.golongan_darah = req.body.golongan_darah
        updated.diajukan_oleh_id = req.user.rnd

        const statusDiperbaruiIndex = utari.status_riwayat.findIndex(riwayat => riwayat.status === "Diperbarui")
        if (statusDiperbaruiIndex !== -1) {
            utari.status_riwayat[statusDiperbaruiIndex] = { status: "Diperbarui", waktu: new Date().toISOString() }
        } else {
            utari.status_riwayat.push({ status: "Diperbarui", waktu: new Date().toISOString() })
        }

        updated.status_riwayat = utari.status_riwayat
        updated.status_riwayat_terbaru = "Diperbarui"

        await prisma.utari.update({
            where: { id },
            data: updated
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const utariDataKeluarga = async (req, res, next) => {
    try {
        const data = req.body
        const diajukanOleh = req.user.rnd
        const { filename, path } = req.file
        const initialStatus = {
            status: "Menunggu",
            waktu: new Date().toISOString()
        }

        const fileData = {
            filename: filename,
            path: path.replace(/\\/g, '/')
        }

        await prisma.utari.create({
            data: {
                fk_kategori_utari_id: parseInt(data.fk_kategori_utari_id),
                diajukan_oleh_id: diajukanOleh,
                no_kk: data.no_kk,
                shdk: data.shdk,
                foto_kk: fileData,
                status_riwayat: [initialStatus],
                status_riwayat_terbaru: initialStatus.status
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const updateUtariDataKeluarga = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const utari = await prisma.utari.findFirst({
            where: { id }
        })

        if (!utari) {
            return res.status(404).json({ message: "Data is not found." })
        }

        const updated = {}
        if (req.file) {
            if (utari.foto_kk) {
                fs.unlinkSync(utari.foto_kk.path)
            }

            const { filename, path } = req.file
            const filepath = path.replace(/\\/g, "/")
            updated.foto_kk = { filename: filename, path: filepath }
        }

        updated.fk_kategori_utari_id = parseInt(req.body.fk_kategori_utari_id)
        updated.diajukan_oleh_id = req.user.rnd
        updated.no_kk = req.body.no_kk
        updated.shdk = req.body.shdk

        const statusDiperbaruiIndex = utari.status_riwayat.findIndex(riwayat => riwayat.status === "Diperbarui")
        if (statusDiperbaruiIndex !== -1) {
            utari.status_riwayat[statusDiperbaruiIndex] = { status: "Diperbarui", waktu: new Date().toISOString() }
        } else {
            utari.status_riwayat.push({ status: "Diperbarui", waktu: new Date().toISOString() })
        }

        updated.status_riwayat = utari.status_riwayat
        updated.status_riwayat_terbaru = "Diperbarui"

        await prisma.utari.update({
            where: { id },
            data: updated
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const utariDataPendidikan = async (req, res, next) => {
    try {
        const data = req.body
        const diajukanOleh = req.user.rnd
        const { filename, path } = req.file
        const initialStatus = {
            status: "Menunggu",
            waktu: new Date().toISOString()
        }

        const fileData = {
            filename: filename,
            path: path.replace(/\\/g, '/')
        }

        await prisma.utari.create({
            data: {
                fk_kategori_utari_id: parseInt(data.fk_kategori_utari_id),
                diajukan_oleh_id: diajukanOleh,
                pendidikan_terakhir: data.pendidikan_terakhir,
                pekerjaan: data.pekerjaan,
                penghasilan: parseInt(data.penghasilan),
                foto_ijazah: fileData,
                status_riwayat: [initialStatus],
                status_riwayat_terbaru: initialStatus.status
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const updateUtariDataPendidikan = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const utari = await prisma.utari.findFirst({
            where: { id }
        })

        if (!utari) {
            return res.status(404).json({ message: "Data is not found." })
        }

        const updated = {}
        if (req.file) {
            if (utari.foto_ijazah) {
                fs.unlinkSync(utari.foto_ijazah.path)
            }

            const { filename, path } = req.file
            const filepath = path.replace(/\\/g, "/")
            updated.foto_ijazah = { filename: filename, path: filepath }
        }

        updated.fk_kategori_utari_id = parseInt(req.body.fk_kategori_utari_id)
        updated.diajukan_oleh_id = req.user.rnd
        updated.pendidikan_terakhir = req.body.pendidikan_terakhir
        updated.pekerjaan = req.body.pekerjaan
        updated.penghasilan = parseInt(req.body.penghasilan)

        const statusDiperbaruiIndex = utari.status_riwayat.findIndex(riwayat => riwayat.status === "Diperbarui")
        if (statusDiperbaruiIndex !== -1) {
            utari.status_riwayat[statusDiperbaruiIndex] = { status: "Diperbarui", waktu: new Date().toISOString() }
        } else {
            utari.status_riwayat.push({ status: "Diperbarui", waktu: new Date().toISOString() })
        }

        updated.status_riwayat = utari.status_riwayat
        updated.status_riwayat_terbaru = "Diperbarui"

        await prisma.utari.update({
            where: { id },
            data: updated
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const utariFotoPenduduk = async (req, res, next) => {
    try {
        const data = req.body
        const diajukanOleh = req.user.rnd
        const { filename, path } = req.file
        const initialStatus = {
            status: "Menunggu",
            waktu: new Date().toISOString()
        }

        const fileData = {
            filename: filename,
            path: path.replace(/\\/g, '/')
        }

        await prisma.utari.create({
            data: {
                fk_kategori_utari_id: parseInt(data.fk_kategori_utari_id),
                diajukan_oleh_id: diajukanOleh,
                foto_penduduk: fileData,
                status_riwayat: [initialStatus],
                status_riwayat_terbaru: initialStatus.status
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const updateUtariFotoPenduduk = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)

        const utari = await prisma.utari.findFirst({
            where: { id }
        })

        if (!utari) {
            return res.status(404).json({ message: "Data is not found." })
        }

        const updated = {}
        if (req.file) {
            if (utari.foto_penduduk) {
                fs.unlinkSync(utari.foto_penduduk.path)
            }

            const { filename, path } = req.file
            const filepath = path.replace(/\\/g, "/")
            updated.foto_penduduk = { filename: filename, path: filepath }
        }

        updated.fk_kategori_utari_id = parseInt(req.body.fk_kategori_utari_id)
        updated.diajukan_oleh_id = req.user.rnd

        const statusDiperbaruiIndex = utari.status_riwayat.findIndex(riwayat => riwayat.status === "Diperbarui")
        if (statusDiperbaruiIndex !== -1) {
            utari.status_riwayat[statusDiperbaruiIndex] = { status: "Diperbarui", waktu: new Date().toISOString() }
        } else {
            utari.status_riwayat.push({ status: "Diperbarui", waktu: new Date().toISOString() })
        }

        updated.status_riwayat = utari.status_riwayat
        updated.status_riwayat_terbaru = "Diperbarui"

        await prisma.utari.update({
            where: { id },
            data: updated
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const dilihat = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const utari = await prisma.utari.findFirst({ where: { id } })

        if (!utari) {
            return res.status(404).json({ message: "Data is not found." })
        }

        await prisma.utari.update({
            where: { id },
            data: { dilihat: true }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const statusPerbaikan = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const data = req.body
        const diterimaOleh = req.user.rnd
        const waktu = new Date().toISOString()

        const utari = await prisma.utari.findFirst({
            where: { id }
        })

        if (!utari) {
            return res.status(404).json({ message: "Data is not found." })
        }

        let perbaikanStatus = utari.status_riwayat.find(riwayat => riwayat.status === "Perbaikan")
        if (perbaikanStatus) {
            perbaikanStatus.waktu = waktu
            perbaikanStatus.catatan = data.catatan
        } else {
            perbaikanStatus = {
                status: "Perbaikan",
                waktu: waktu,
                catatan: data.catatan
            }
            utari.status_riwayat.push(perbaikanStatus)
        }

        await prisma.utari.update({
            where: { id },
            data: {
                diterima_oleh_id: diterimaOleh,
                status_riwayat: utari.status_riwayat,
                status_riwayat_terbaru: "Perbaikan"
            }
        })

        res.status(200).json({ message: "Successfully." })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

const statusDiterima = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id)
        const diterimaOleh = req.user.rnd
        const waktu = new Date().toISOString()

        const utari = await prisma.utari.findFirst({
            where: { id }
        })

        if (!utari) {
            return res.status(404).json({ message: "Data is not found." })
        }

        utari.status_riwayat.push({
            status: "Disetujui",
            waktu: waktu
        })

        await prisma.utari.update({
            where: { id },
            data: {
                diterima_oleh_id: diterimaOleh,
                status_riwayat: utari.status_riwayat,
                status_riwayat_terbaru: "Disetujui",
                uts: new Date()
            }
        })

        const penggunaPribadi = await prisma.penggunaPribadi.findFirst({
            where: { id: utari.dibuat_oleh_id },
            include: {
                penduduk: true
            }
        })

        if (penggunaPribadi && penggunaPribadi.penduduk) {
            const existingPenduduk = penggunaPribadi.penduduk

            await prisma.penduduk.update({
                where: { id: existingPenduduk.id },
                data: {
                    no_kk: utari.no_kk ?? existingPenduduk.no_kk,
                    nama_lengkap: utari.nama_lengkap ?? existingPenduduk.nama_lengkap,
                    jenis_kelamin: utari.jenis_kelamin ?? existingPenduduk.jenis_kelamin,
                    tempat_lahir: utari.tempat_lahir ?? existingPenduduk.tempat_lahir,
                    tanggal_lahir: utari.tanggal_lahir ?? existingPenduduk.tanggal_lahir,
                    alamat: utari.alamat ?? existingPenduduk.alamat,
                    status_nikah: utari.status_nikah ?? existingPenduduk.status_nikah,
                    shdk: utari.shdk ?? existingPenduduk.shdk,
                    agama: utari.agama ?? existingPenduduk.agama,
                    suku_bangsa: utari.suku_bangsa ?? existingPenduduk.suku_bangsa,
                    kewarganegaraan: utari.kewarganegaraan ?? existingPenduduk.kewarganegaraan,
                    pendidikan_terakhir: utari.pendidikan_terakhir ?? existingPenduduk.pendidikan_terakhir,
                    pekerjaan: utari.pekerjaan ?? existingPenduduk.pekerjaan,
                    golongan_darah: utari.golongan_darah ?? existingPenduduk.golongan_darah,
                    penghasilan: utari.penghasilan ?? existingPenduduk.penghasilan,
                    foto_penduduk: utari.foto_penduduk ?? existingPenduduk.foto_penduduk,
                    foto_ktp: utari.foto_ktp ?? existingPenduduk.foto_ktp,
                    foto_kk: utari.foto_kk ?? existingPenduduk.foto_kk,
                    foto_ijazah: utari.foto_ijazah ?? existingPenduduk.foto_ijazah,
                    uts: new Date()
                }
            })
        }

        res.status(200).json({ message: 'Successfully.' })
    } catch (error) {
        console.error("ERROR =>", error)
        next(new ResponseError(500, "Internal server error"))
    }
}

module.exports = {
    utari,
    utariById,
    utariDetails,
    utariDetailById,
    utariDetailByUser,
    utariFilter,
    utariDataPenduduk,
    updateUtariDataPenduduk,
    utariDataKeluarga,
    updateUtariDataKeluarga,
    utariDataPendidikan,
    updateUtariDataPendidikan,
    utariFotoPenduduk,
    updateUtariFotoPenduduk,
    dilihat,
    statusPerbaikan,
    statusDiterima
}